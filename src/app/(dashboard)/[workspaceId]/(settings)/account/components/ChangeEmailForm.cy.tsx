import React from "react";
import { ChangeEmailForm } from "./change-email-form";

describe("<ChangeEmailForm />", () => {
  const user = { email: "new@email.com", password: "password" };
  const oldEmail = "test@email.com";
  beforeEach(() => {
    cy.mount(<ChangeEmailForm email={oldEmail} />);

    cy.findByTestId("submit").should("be.disabled");

    cy.findByTestId("email").as("emailInput").type(user.email);
    cy.findByTestId("password").as("passwordInput").type(user.password);
  });

  it("Success Change Email", () => {
    cy.intercept("POST", "**/users/change_email", { statusCode: 200 }).as(
      "changeEmail"
    );
    cy.findByTestId("change-email-form").submit();
    cy.wait("@changeEmail").its("request.body").should("deep.equal", user);

    cy.get("@refresh").should("be.called", 1);
    cy.findByRole("alert").should("exist");
  });

  describe("Fail Change Email", () => {
    it("Fail with the same email", () => {
      cy.get("@emailInput").clear();
      cy.get("@emailInput").type(oldEmail);

      cy.findByTestId("change-email-form").submit();
      cy.findAllByRole("alert").should("have.length", 1);
    });

    it("Fail with unkown error", () => {
      cy.intercept("POST", "**/users/change_email", { statusCode: 400 }).as(
        "changeEmail"
      );

      cy.findByTestId("change-email-form").submit();
      cy.wait("@changeEmail").its("request.body").should("deep.equal", user);

      cy.get("@refresh").should("not.be.called");
      cy.findByRole("alert").should("exist");
    });

    it("Fail with wrong password", () => {
      cy.intercept("POST", "**/users/change_email", {
        statusCode: 400,
        body: { message: "invalid password" },
      }).as("changeEmail");

      cy.findByTestId("change-email-form").submit();
      cy.wait("@changeEmail").its("request.body").should("deep.equal", user);

      cy.get("@refresh").should("not.be.called");
      cy.findByRole("alert").should("exist");
    });

    it("Fail invalid body request", () => {
      cy.findByTestId("email").clear();
      cy.findByTestId("password").clear();
      cy.findByTestId("change-email-form").submit();

      cy.get("@refresh").should("not.be.called");
      cy.findAllByRole("alert").should("have.length", 2);
      cy.findByTestId("email").type("invalidemail");
      cy.findAllByRole("alert").should("have.length", 2);
    });
  });
});
