import React from "react";
import { AddMemberForm } from "./add-member-form";

describe("<AddMemberForm />", () => {
  beforeEach(() => {
    cy.mount(<AddMemberForm workspaceId="1" />);
    cy.findByTestId("email").as("emailInput");
    cy.findByTestId("role").as("roleSelect");
    cy.findByTestId("submit").as("submitButton").should("be.disabled");
    cy.findByTestId("add-member-form").as("addMemberForm");
  });

  context("Success add new member", () => {
    beforeEach(() => {
      cy.intercept("POST", "**/workspaces/*/members", { statusCode: 200 }).as(
        "addMember"
      );

      cy.get("@emailInput").type("test@email.com");
      cy.get("@roleSelect").click();
    });
    it("Success add new admin member", () => {
      cy.findAllByRole("option").contains("Admin").click();
      cy.get("@submitButton").click();
      cy.wait("@addMember")
        .its("request.body")
        .should("deep.equal", { email: "test@email.com", role: "admin" });
    });

    it("Success add new writer member", () => {
      cy.findAllByRole("option").contains("Writer").click();
      cy.get("@submitButton").click();
      cy.wait("@addMember")
        .its("request.body")
        .should("deep.equal", { email: "test@email.com", role: "writer" });
    });
    it("Success add new reader member", () => {
      cy.findAllByRole("option").contains("Reader").click();
      cy.get("@submitButton").click();
      cy.wait("@addMember")
        .its("request.body")
        .should("deep.equal", { email: "test@email.com", role: "reader" });
    });

    afterEach(() => {
      cy.get("@refresh").should("be.calledOnce");
      cy.get("@emailInput").should("be.empty");
      cy.get("@submitButton").should("be.disabled");
    });
  });

  it("Fail add new member with invalid body request", () => {
    cy.get("@addMemberForm").submit();
    cy.get("@submitButton").should("be.disabled");
    cy.findAllByRole("alert").should("have.length", 2);

    cy.get("@emailInput").type("invalidEmail");
    cy.get("@submitButton").should("be.disabled");
    cy.findAllByRole("alert").should("have.length", 2);

    cy.get("@emailInput").clear();
    cy.get("@emailInput").type("test@email.com");
    cy.get("@submitButton").should("be.disabled");
    cy.findAllByRole("alert").should("have.length", 1);

    cy.get("@roleSelect").click();
    cy.findAllByRole("option").contains("Writer").click();
    cy.findAllByRole("alert").should("have.length", 0);
  });

  it("Fail add new member with wrong email", () => {
    cy.intercept("POST", "**/workspaces/*/members", { statusCode: 404 }).as(
      "addMember"
    );

    cy.get("@emailInput").type("test@email.com");
    cy.get("@roleSelect").click();
    cy.findAllByRole("option").contains("Writer").click();
    cy.get("@submitButton").click();
    cy.wait("@addMember")
      .its("request.body")
      .should("deep.equal", { email: "test@email.com", role: "writer" });
    cy.get("@refresh").should("not.be.called");
    cy.get("@submitButton").should("be.disabled");
    cy.findByRole("alert").should("exist");
  });

  it("Fail add new member with unkown error", () => {
    cy.intercept("POST", "**/workspaces/*/members", { statusCode: 500 }).as(
      "addMember"
    );

    cy.get("@emailInput").type("test@email.com");
    cy.get("@roleSelect").click();
    cy.findAllByRole("option").contains("Writer").click();
    cy.get("@submitButton").click();
    cy.wait("@addMember")
      .its("request.body")
      .should("deep.equal", { email: "test@email.com", role: "writer" });
    cy.get("@refresh").should("not.be.called");
    cy.get("@submitButton").should("be.disabled");
    cy.findByRole("alert").should("exist");
  });
});
