import React from "react";
import { EditWorkspaceForm } from "./edit-workspace-form";
import { Workspace } from "@/types";

describe("<EditWorkspaceForm />", () => {
  beforeEach(() => {
    cy.fixture("workspace-info.json").then((workspace: Workspace) => {
      cy.mount(<EditWorkspaceForm workspace={workspace} />);
    });

    cy.findByTestId("name").as("nameInput");
    cy.findByTestId("workspace-form").as("workspaceForm");
    cy.findByTestId("submit").as("submitButton");
    cy.get("@submitButton").should("be.disabled");
  });

  it("Success edit workspace name", () => {
    cy.intercept("PATCH", "**/workspaces/**", { statusCode: 200 }).as(
      "editWorkspace"
    );

    cy.get("@nameInput").type("{backspace}");
    cy.get("@workspaceForm").submit();
    cy.wait("@editWorkspace")
      .its("request.body")
      .should("deep.equal", { name: "Workspace Nam" });
    cy.get("@refresh").should("be.calledOnce");
    cy.findByRole("alert").should("be.visible");
    cy.get("@nameInput").should("have.value", "Workspace Nam");
  });

  it("Fails with unkown error", () => {
    cy.intercept("PATCH", "**/workspaces/**", { statusCode: 500 }).as(
      "editWorkspace"
    );
    cy.get("@workspaceForm").submit();
    cy.wait("@editWorkspace")
      .its("request.body")
      .should("deep.equal", { name: "Workspace Name" });
    cy.get("@refresh").should("not.be.called");
    cy.findByRole("alert").should("be.visible");
  });

  it("Fails with invalid body request", () => {
    cy.get("@nameInput").clear();
    cy.get("@workspaceForm").submit();
    cy.findByRole("alert").should("be.visible");
  });
});
