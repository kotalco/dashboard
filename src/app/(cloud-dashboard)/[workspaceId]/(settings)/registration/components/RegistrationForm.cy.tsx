import React from "react";
import { RegistrationForm } from "./registration-form";

describe("<RegistrationForm />", () => {
  it("renders form with toggle off", () => {
    cy.mount(<RegistrationForm />);
    cy.findByTestId("enable-switch").should(
      "have.attr",
      "data-state",
      "unchecked"
    );
  });

  it("success submit the form", () => {
    cy.intercept("POST", "**/settings/registration", { statusCode: 200 }).as(
      "submitRegistration"
    );
    cy.mount(<RegistrationForm />);
    cy.findByTestId("submit").should("be.disabled");
    cy.findByTestId("enable-switch").click();
    cy.findByTestId("registration-form").submit();
    cy.wait("@submitRegistration")
      .its("request.body")
      .should("deep.equal", { enable_registration: true });
    cy.findByRole("alert").should("exist");
  });

  it("fail submit the form with unkown error", () => {
    cy.intercept("POST", "**/settings/registration", { statusCode: 500 }).as(
      "submitRegistration"
    );
    cy.mount(<RegistrationForm isEnabled={true} />);
    cy.findByTestId("submit").should("be.disabled");
    cy.findByTestId("enable-switch").click();
    cy.findByTestId("registration-form").submit();
    cy.wait("@submitRegistration")
      .its("request.body")
      .should("deep.equal", { enable_registration: false });
    cy.findByRole("alert").should("exist");
  });

  it("renders form with toggle on", () => {
    cy.mount(<RegistrationForm isEnabled={true} />);
    cy.findByTestId("enable-switch").should(
      "have.attr",
      "data-state",
      "checked"
    );
  });

  it("success submit the form", () => {
    cy.mount(<RegistrationForm />);
  });
});
