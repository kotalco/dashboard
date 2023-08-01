import React from "react";
import { LoginForm } from "./login-form";

describe("<LoginForm />", () => {
  beforeEach(() => {
    cy.mount(<LoginForm />);
  });

  it("Checks for Forget Password link", () => {
    cy.get('a[href="/forget-password"]');
  });

  describe("Login", () => {
    const credetials = { email: "test@email.com", password: "password" };
    beforeEach(() => {
      cy.intercept("POST", "**/set-cookie", {
        statusCode: 200,
      });
      cy.findByTestId("submit-login").should("be.disabled");

      cy.findByTestId("email").type(credetials.email);
      cy.findByTestId("password").type(credetials.password);
    });

    context("Success Login with Authorized user", () => {
      beforeEach(() => {
        cy.intercept("POST", "**/sessions", {
          fixture: "authorized-user.json",
        }).as("userLogin");
      });

      it("Without checking remember me", () => {
        cy.findByTestId("login-form").submit();
        cy.wait("@userLogin")
          .its("request.body")
          .should("deep.equal", { ...credetials, remember_me: false });

        cy.get("@replace").should("be.called", 1);
      });

      it("With checking remember me", () => {
        cy.findByTestId("remember-me").click();
        cy.findByTestId("login-form").submit();
        cy.wait("@userLogin")
          .its("request.body")
          .should("deep.equal", { ...credetials, remember_me: true });

        cy.get("@replace").should("be.called", 1);
      });
    });

    context("Failed Login", () => {
      beforeEach(() => {});

      it("Fails with wrong email or password", () => {
        cy.intercept("POST", "**/sessions", { statusCode: 401 }).as(
          "userLogin"
        );
        cy.findByTestId("login-form").submit();
        cy.wait("@userLogin")
          .its("request.body")
          .should("deep.equal", { ...credetials, remember_me: false });

        cy.get("@replace").should("not.be.called");
        cy.findByRole("alert").should("exist");
      });

      it("Fails with unkown error", () => {
        cy.intercept("POST", "**/sessions", { statusCode: 400 }).as(
          "userLogin"
        );
        cy.findByTestId("login-form").submit();
        cy.wait("@userLogin")
          .its("request.body")
          .should("deep.equal", { ...credetials, remember_me: false });

        cy.get("@replace").should("not.be.called");
        cy.findByRole("alert").should("exist");
      });

      it("Fails with invalid body request", () => {
        cy.findByTestId("email").clear();
        cy.findByTestId("password").clear();
        cy.findByTestId("login-form").submit();

        cy.get("@replace").should("not.be.called");
        cy.findAllByRole("alert").should("have.length", 2);
        cy.findByTestId("email").type("invalidemail");
        cy.findAllByRole("alert").should("have.length", 2);
      });

      describe("Fails with unverified email", () => {
        beforeEach(() => {
          cy.intercept("POST", "**/sessions", { statusCode: 403 }).as(
            "userLogin"
          );
          cy.findByTestId("login-form").submit();
          cy.wait("@userLogin")
            .its("request.body")
            .should("deep.equal", { ...credetials, remember_me: false });

          cy.get("@replace").should("not.be.called");
          cy.findByRole("alert").should("exist").as("error");
        });

        it("Success Resend Verification Email", () => {
          cy.intercept("POST", "**/users/resend_email_verification", {
            statusCode: 200,
          }).as("resendVerification");

          cy.get("@error").find("button").click();
          cy.wait("@resendVerification");
          cy.findByRole("alert").should("exist");
        });

        describe("Failed Resend Verification Email", () => {
          it("Fail with Email ALready verified", () => {
            cy.intercept("POST", "**/users/resend_email_verification", {
              statusCode: 400,
            }).as("resendVerification");

            cy.get("@error").find("button").click();
            cy.wait("@resendVerification");
            cy.findByRole("alert").should("exist");
          });

          it("Fail with Email not found", () => {
            cy.intercept("POST", "**/users/resend_email_verification", {
              statusCode: 404,
            }).as("resendVerification");

            cy.get("@error").find("button").click();
            cy.wait("@resendVerification");
            cy.findByRole("alert").should("exist");
          });

          it("Fail with unkown error", () => {
            cy.intercept("POST", "**/users/resend_email_verification", {
              statusCode: 500,
            }).as("resendVerification");

            cy.get("@error").find("button").click();
            cy.wait("@resendVerification");
            cy.findByRole("alert").should("exist");
          });
        });
      });
    });

    context("Not authorized user (Require Two-factor authentication)", () => {
      beforeEach(() => {
        cy.intercept("POST", "**/sessions", {
          fixture: "not-authorized-user.json",
        }).as("userLogin");

        cy.findByTestId("login-form").submit();
        cy.findByTestId("submit-verification").should("be.disabled");
        cy.wait("@userLogin")
          .its("request.body")
          .should("deep.equal", { ...credetials, remember_me: false });

        cy.get("@replace").should("not.be.calledOn");
      });

      it("Success Authorization", () => {
        cy.intercept("POST", "**/users/totp/verify", {
          fixture: "authorized-user.json",
        }).as("userVerify");

        cy.findAllByTestId("otp-input").first().type("123456");
        cy.findByTestId("verification-form").as("verificationForm").submit();
        cy.wait("@userVerify")
          .its("request.body")
          .should("deep.equal", { totp: "123456" });

        cy.get("@replace").should("be.called", 1);
        cy.get("@verificationForm").should("not.exist");
      });

      it("Failed Authorization", () => {
        cy.intercept("POST", "**/users/totp/verify", {
          statusCode: 400,
        }).as("userVerify");

        cy.findAllByTestId("otp-input").first().type("123456");
        cy.findByTestId("verification-form").as("verificationForm").submit();
        cy.wait("@userVerify");
        cy.get("@replace").should("not.be.calledOn");
        cy.get("@verificationForm").should("exist");
        cy.findByTestId("submit-verification").should("be.disabled");
        cy.findByRole("alert").should("exist");
      });

      it("Invalid body request", () => {
        cy.findAllByTestId("otp-input").first().type("123");
        cy.findByTestId("verification-form").as("verificationForm").submit();

        cy.get("@replace").should("not.be.calledOn");
        cy.get("@verificationForm").should("exist");
        cy.findByTestId("submit-verification").should("be.disabled");
        cy.findByRole("alert").should("exist");
      });
    });
  });
});
