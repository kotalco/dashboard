import React from "react";
import { ChangePasswordForm } from "./change-password-form";

describe("<ChangePasswordForm />", () => {
  const data = {
    old_password: "oldPassword",
    password: "password",
    password_confirmation: "password",
  };
  beforeEach(() => {
    cy.mount(<ChangePasswordForm />);

    cy.findByTestId("submit").should("be.disabled");

    cy.findByTestId("current-password")
      .as("currentPasswordInput")
      .type(data.old_password);
    cy.findByTestId("new-password").as("newPasswordInput").type(data.password);
    cy.findByTestId("confirm-new-password")
      .as("confirmNewPasswordInput")
      .type(data.password_confirmation);
  });

  it("Success Change Password", () => {
    cy.intercept("POST", "**/users/change_password", { statusCode: 200 }).as(
      "changePassword"
    );
    cy.findByTestId("change-password-form").submit();
    cy.wait("@changePassword").its("request.body").should("deep.equal", data);

    cy.findByRole("alert").should("exist");
  });

  describe("Fail Change Password", () => {
    it("Fail with wrong old password", () => {
      cy.intercept("POST", "**/users/change_password", { statusCode: 401 }).as(
        "changePassword"
      );
      cy.findByTestId("change-password-form").submit();
      cy.wait("@changePassword").its("request.body").should("deep.equal", data);

      cy.findByRole("alert").should("exist");
    });

    it("Fail with unkown error", () => {
      cy.intercept("POST", "**/users/change_password", { statusCode: 500 }).as(
        "changePassword"
      );
      cy.findByTestId("change-password-form").submit();
      cy.wait("@changePassword").its("request.body").should("deep.equal", data);

      cy.findByRole("alert").should("exist");
    });

    it("Fail with invalid body request", () => {
      cy.get("@currentPasswordInput").clear();
      cy.get("@newPasswordInput").clear();
      cy.get("@confirmNewPasswordInput").clear();
      cy.findByTestId("change-password-form").submit();
      cy.findAllByRole("alert").should("have.length", 3);

      cy.get("@currentPasswordInput").type("123");
      cy.findAllByRole("alert").should("have.length", 3);

      cy.get("@newPasswordInput").type("123");
      cy.get("@confirmNewPasswordInput").type("456");
      cy.findAllByRole("alert").should("have.length", 3);
    });
  });
});
