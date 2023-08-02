import React from "react";
import { DeleteWorkspace } from "./delete-workspace";
import { Workspace } from "@/types";

describe("<LeaveWorkspace />", () => {
  beforeEach(() => {
    cy.fixture("workspace-info.json").then((workspace: Workspace) => {
      cy.mount(<DeleteWorkspace workspace={workspace} />);
    });
    cy.findByTestId("delete-button").click();
    cy.findByRole("dialog").should("be.visible");
    cy.findByTestId("cancel-button").as("cancelButton");
    cy.findByTestId("confirm-button").as("confirmButton");
  });

  it("Cancel delete workspace", () => {
    cy.get("@cancelButton").click();
    cy.findByRole("dialog").should("not.exist");
  });

  context("Confirm delete workspace", () => {
    it("Success delete workspace", () => {
      cy.intercept("DELETE", "**/workspaces/*", { statusCode: 200 }).as(
        "confirmDelete"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmDelete");
      cy.get("@push").should("be.calledOnce");
    });

    it("Fail delete workspace with unkown error", () => {
      cy.intercept("DELETE", "**/workspaces/*", { statusCode: 500 }).as(
        "confirmDelete"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmDelete");
      cy.get("@push").should("not.be.called");
      cy.findByRole("dialog").should("exist");
      cy.findByRole("alert").should("exist");
    });

    it("Fail delete workspace with 403", () => {
      cy.intercept("DELETE", "**/workspaces/*", { statusCode: 403 }).as(
        "confirmDelete"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmDelete");
      cy.get("@push").should("not.be.called");
      cy.findByRole("dialog").should("exist");
      cy.findByRole("alert").should("exist");
    });
  });
});
