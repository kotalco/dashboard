import React from "react";

import { TwoFactorAuthForm } from "./two-factor-auth-form";

describe("<TwoFactorAuthForm />", () => {
  const passwordData = { password: "123456" };
  context("Disabled Two Factor Auth", () => {
    beforeEach(() => {
      cy.mount(<TwoFactorAuthForm enabled={false} />);
      cy.get("button").contains("Enable").click();
      cy.get("h2").contains("Enable").should("exist");
      cy.findByTestId("submit").should("be.disabled");
      cy.findByTestId("password-form").as("passwordForm");
      cy.findByTestId("password")
        .as("passwordInput")
        .type(passwordData.password);
    });

    it("Cancel before submition", () => {
      cy.findByTestId("cancel").click();
      cy.get("@passwordForm").should("not.exist");
      cy.get("button").contains("Enable").click();
      cy.get("@passwordInput").should("be.empty");
    });

    context("QR Code Form", () => {
      const otp = { totp: "123456" };
      beforeEach(() => {
        cy.fixture("images/qrcode.png").then((image) => {
          const blob = Cypress.Blob.base64StringToBlob(image, "image/png");
          cy.intercept("POST", "**/users/totp", (req) => {
            req.reply(200, { data: blob }, { "Content-Type": "image/png" });
          }).as("checkPassword");
        });

        cy.get("@passwordForm").submit();
        cy.wait("@checkPassword");
        cy.get("@passwordForm").should("not.exist");
        cy.findByTestId("qr-code-form").as("qrCodeForm");
        cy.get("@qrCodeForm").find("img");

        cy.findByTestId("submit").should("be.disabled");
        cy.findAllByTestId("otp-input").first().type(otp.totp);
      });

      it("Success Enable Two Factor Auth", () => {
        cy.intercept("POST", "**/users/totp/enable", { statusCode: 200 }).as(
          "enable2fa"
        );

        cy.get("@qrCodeForm").submit();
        cy.wait("@enable2fa").its("request.body").should("deep.equal", otp);

        cy.get("@refresh").should("have.been.calledOnce");
        cy.get("@qrCodeForm").should("not.exist");
      });

      it("Fails Enable Two Factor Auth", () => {
        cy.findAllByTestId("otp-input").last().type("{backspace}");
        cy.get("@qrCodeForm").submit();

        cy.get("@refresh").should("not.be.called");
        cy.get("@qrCodeForm").should("exist");
        cy.findByRole("alert").should("exist");
      });

      it("Cancel before submition", () => {
        cy.get("svg").click();
        cy.get("@qrCodeForm").should("not.exist");
        cy.get("button").contains("Enable").click();
        cy.get("@passwordInput").should("be.empty");
      });
    });

    context("Password form", () => {
      it("Fails with wrong password", () => {
        cy.intercept("POST", "**/users/totp", { statusCode: 400 }).as(
          "checkPassword"
        );

        cy.get("@passwordForm").submit();
        cy.wait("@checkPassword")
          .its("request.body")
          .should("deep.equal", passwordData);

        cy.get("@passwordInput").should("exist");
        cy.findByRole("alert").should("exist");
      });

      it("Fails with unkown error", () => {
        cy.intercept("POST", "**/users/totp", { statusCode: 500 }).as(
          "checkPassword"
        );

        cy.get("@passwordForm").submit();
        cy.wait("@checkPassword")
          .its("request.body")
          .should("deep.equal", passwordData);

        cy.get("@passwordInput").should("exist");
        cy.findByRole("alert").should("exist");
      });

      it("Fails with invalid request body", () => {
        cy.get("@passwordInput").clear();
        cy.get("@passwordForm").submit();
        cy.findByRole("alert").should("exist");

        cy.get("@passwordInput").type("123");
        cy.findByRole("alert").should("exist");
      });
    });
  });

  context("Enabled Two Factor Auth", () => {
    beforeEach(() => {
      cy.mount(<TwoFactorAuthForm enabled={true} />);
      cy.get("button").contains("Disable").click();
      cy.get("h2").contains("Disable").should("exist");
      cy.findByTestId("password-form").as("passwordForm");
      cy.findByTestId("password")
        .as("passwordInput")
        .type(passwordData.password);
    });

    it("Success Disable Two Factor Auth", () => {
      cy.intercept("POST", "**/users/totp/disable", { statusCode: 200 }).as(
        "disable2fa"
      );

      cy.get("@passwordForm").submit();
      cy.wait("@disable2fa")
        .its("request.body")
        .should("deep.equal", passwordData);

      cy.get("@refresh").should("have.been.calledOnce");
      cy.get("@passwordForm").should("not.exist");
    });

    it("Fails with wrong password", () => {
      cy.intercept("POST", "**/users/totp/disable", { statusCode: 400 }).as(
        "checkPassword"
      );

      cy.get("@passwordForm").submit();
      cy.wait("@checkPassword")
        .its("request.body")
        .should("deep.equal", passwordData);

      cy.get("@passwordInput").should("exist");
      cy.findByRole("alert").should("exist");
    });

    it("Fails with unkown error", () => {
      cy.intercept("POST", "**/users/totp/disable", { statusCode: 500 }).as(
        "checkPassword"
      );

      cy.get("@passwordForm").submit();
      cy.wait("@checkPassword")
        .its("request.body")
        .should("deep.equal", passwordData);

      cy.get("@passwordInput").should("exist");
      cy.findByRole("alert").should("exist");
    });

    it("Fails with invalid request body", () => {
      cy.get("@passwordInput").clear();
      cy.get("@passwordForm").submit();
      cy.findByRole("alert").should("exist");

      cy.get("@passwordInput").type("123");
      cy.findByRole("alert").should("exist");
    });
  });
});
