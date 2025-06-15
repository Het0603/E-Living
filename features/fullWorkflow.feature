Feature: Lifely POC

  Scenario: Validate PDP with API data
    Given I fetch and store all products from Lifely
    And I pick a random product to work with
    When I visit the homepage
    And I pick a random product and search for it
    And I click on the product in search results
    Then I should see correct product title and pricing
    And I validate the button status for all variants
    And I add the product to cart and proceed to checkout
    And I fill in the shipping details and calculate shipping

  Scenario: Validate availability for all shipping postcodes
    Given I validate shipping for "300" random postal codes

  Scenario: Validate availability for the given shipping postcode
    Given I validate shipping for postal codes "0001, 0001, 7000, 0003, 0004, 0005"