describe("MoviesGrid", () => {
  it("should load genres and display them", () => {
    cy.visit("http://localhost:3000");
    cy.get(".text-4xl").should("be.visible");
    cy.get("[data-testid='genre-row']").should("have.length.greaterThan", 0);
  });
});

describe("Swiper Navigation", () => {
  it("should allow navigation between slides using arrows", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
        cy.get(".swiper-button-next").click();
        cy.get("[data-testid='movie-card']")
          .eq(1)
          .should("have.class", "active");
        cy.get(".swiper-button-prev").click();
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });
  });
});

describe("Keyboard Arrow Navigation", () => {
  it("should move to the correct active slide when using arrow keys", () => {
    cy.visit("http://localhost:3000");
    cy.get(".swiper-wrapper").should("be.visible");

    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });

    cy.get("body").type("{rightarrow}");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .eq(1)
          .should("have.class", "active");
      });

    cy.get("body").type("{leftarrow}");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });

    cy.get("body").type("{leftarrow}");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .last()
          .should("have.class", "active");
      });

    cy.get("body").type("{rightarrow}");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });

    cy.get("body").type("{downarrow}");
    cy.get("[data-testid='genre-row']")
      .eq(1)
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });

    cy.get("body").type("{uparrow}");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .first()
          .should("have.class", "active");
      });
  });
});

describe("Movie Card Hover Interaction", () => {
  it("should update active slide index when hovering over a movie card", () => {
    cy.visit("http://localhost:3000");
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']").eq(1).trigger("mouseover");
      });
    cy.get("[data-testid='genre-row']")
      .first()
      .within(() => {
        cy.get("[data-testid='movie-card']")
          .eq(1)
          .should("have.class", "active");
      });
  });
});
