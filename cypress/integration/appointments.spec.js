describe("Appointments", () => {
  beforeEach(() => {
    //reset DB
    cy.request("GET", "/api/debug/reset");

    //root node
    cy.visit("/");

    //Monday exists
    cy.contains("[data-testid=day]", "Monday");
    // .should("be.visible"); <---contains already checks.
  });

  xit("should book an interview", () => {
    cy.get("[alt=Add]").first().click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");

    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  xit("should edit an interview", () => {
    cy.get("[alt=Edit]").first().click({ force: true }); //enables clicking on hidden elements

    cy.get("[alt='Tori Malcolm']").click();

    cy.get("[data-testid=student-name-input]").clear().type("Robert");

    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Robert");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should delete an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true }); //enables clicking on hidden elements

    cy.contains("Confirm").click();

    //timing is kinda quircky with cypress
    cy.contains("Deleting");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
