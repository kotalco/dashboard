import React from "react";
import { DomainForm } from "./domain-form";

describe("<DomainForm />", () => {
  const data = {
    domainName: "kotal.co",
    ip: { ip_address: "10.0.0.1", host_name: "" },
  };
  context("With default value", () => {
    it("Renders with default value", () => {
      cy.mount(<DomainForm ip={data.ip} domainName={data.domainName} />);
      cy.findByRole("alert").contains(data.domainName);
      cy.findByRole("alert").contains(data.ip.ip_address);
      cy.findByTestId("domain-name").should("have.value", data.domainName);
    });
  });

  context("Without default value", () => {
    beforeEach(() => {
      cy.clock();
      cy.mount(<DomainForm ip={{ ip_address: "10.0.0.1", host_name: "" }} />);
    });

    it("Renders without alert and empty input value", () => {
      cy.findByRole("alert").should("not.exist");
      cy.findByTestId("domain-name").should("be.empty");
    });

    describe("Setting new domain name", () => {
      beforeEach(() => {
        cy.findByTestId("domain-name")
          .as("domainNameInput")
          .type(data.domainName);
        cy.findByTestId("is-aware").as("isAwareCheck").click();
        cy.findByTestId("is-updated").as("isUpdatedCheck").click();
        cy.findByTestId("domain-form").as("domainForm");
      });

      it("Ensure that alert is now visible", () => {
        cy.findByRole("alert").contains(data.domainName);
        cy.findByRole("alert").contains(data.ip.ip_address);
      });

      it("Succes update domain name value", () => {
        cy.intercept("POST", "**/settings/domain", { statusCode: 200 }).as(
          "setDomain"
        );
        cy.stub(window, "open");
        cy.get("@domainForm").submit();

        cy.wait("@setDomain").its("request.body").should("deep.equal", {
          domain: data.domainName,
        });
        cy.findByTestId("submit").contains("10");
        cy.tick(1000);
        cy.findByTestId("submit").contains("9");

        cy.tick(9000);
        cy.window()
          .its("open")
          .should("be.calledOnceWith", `https://${data.domainName}`, "_self");
        cy.findAllByRole("alert").should("have.length", 2);
      });

      describe("Fails update value", () => {
        it("Fail with unkown error", () => {
          cy.intercept("POST", "**/settings/domain", { statusCode: 500 }).as(
            "setDomain"
          );
          cy.get("@domainForm").submit();

          cy.wait("@setDomain").its("request.body").should("deep.equal", {
            domain: data.domainName,
          });
          cy.findAllByRole("alert").should("have.length", 2);
        });

        it("Fail with invalid body request", () => {
          cy.get("@domainNameInput").clear();
          cy.get("@domainForm").submit();
          cy.findAllByRole("alert").should("have.length", 1);

          cy.get("@isAwareCheck").click();
          cy.findAllByRole("alert").should("have.length", 2);

          cy.get("@isUpdatedCheck").click();
          cy.findAllByRole("alert").should("have.length", 3);
        });
      });
    });
  });
});
