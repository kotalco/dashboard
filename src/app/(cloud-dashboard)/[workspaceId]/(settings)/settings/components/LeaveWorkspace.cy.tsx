import React from "react";
import { LeaveWorkspace } from "./leave-workspace";

describe("<LeaveWorkspace />", () => {
  beforeEach(() => {
    cy.mount(<LeaveWorkspace workspaceId="1" />);
    cy.findByTestId("leave-button").click();
    cy.findByRole("dialog").should("be.visible");
    cy.findByTestId("cancel-button").as("cancelButton");
    cy.findByTestId("confirm-button").as("confirmButton");
  });

  it("Cancel leave workspace", () => {
    cy.get("@cancelButton").click();
    cy.findByRole("dialog").should("not.exist");
  });

  context("Confirm leave workspace", () => {
    it("Success leave workspace", () => {
      cy.intercept("POST", "**/workspaces/*/leave", { statusCode: 200 }).as(
        "confirmLeave"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmLeave");
      cy.get("@push").should("be.calledOnce");
    });

    it("Fail leave workspace with unkown error", () => {
      cy.intercept("POST", "**/workspaces/*/leave", { statusCode: 500 }).as(
        "confirmLeave"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmLeave");
      cy.get("@push").should("not.be.called");
      cy.findByRole("dialog").should("exist");
      cy.findByRole("alert").should("exist");
    });

    it("Fail leave workspace with 403", () => {
      cy.intercept("POST", "**/workspaces/*/leave", { statusCode: 403 }).as(
        "confirmLeave"
      );
      cy.get("@confirmButton").click();
      cy.wait("@confirmLeave");
      cy.get("@push").should("not.be.called");
      cy.findByRole("dialog").should("exist");
      cy.findByRole("alert").should("exist");
    });
  });
});
