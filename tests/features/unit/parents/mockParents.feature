Feature: Parent data access helpers
  As a developer working with mock parent data
  I want reliable data access functions
  So that parent information can be retrieved and queried

  # getAllParents

  Scenario: Retrieve all parents
    When getting all parents
    Then there should be exactly 12 parents

  Scenario: Each parent has required fields
    Given all parents
    Then each parent should have id, firstName, lastName, email, phone, children, totalOutstandingFees, totalPaidFees, and status
    And each parent should have at least one child

  # getParentById

  Scenario: Retrieve a parent by valid ID
    When getting a parent by ID "parent-001"
    Then the correct parent should be returned with firstName "Emeka" and lastName "Okonkwo"

  Scenario: Retrieve a parent by non-existent ID
    When getting a parent by ID "nonexistent"
    Then undefined should be returned

  # getParentsByStatus

  Scenario: Retrieve all active parents
    When getting parents by "Active" status
    Then there should be at least one result
    And all returned parents should have "Active" status

  Scenario: Retrieve inactive parents when none exist
    When getting parents by "Inactive" status
    Then no parents should be returned

  # getParentsWithOutstandingFees

  Scenario: Retrieve parents with outstanding fees
    When getting parents with outstanding fees
    Then all returned parents should have outstanding fees greater than zero

  Scenario: Parents with zero fees are excluded
    When getting parents with outstanding fees
    Then parents "parent-002" and "parent-009" should not be included

  # searchParents

  Scenario: Search by first name
    When searching for "Emeka"
    Then at least one parent should be found
    And the first result should have firstName "Emeka"

  Scenario: Search by last name
    When searching for "Adeyemi"
    Then at least one parent should be found
    And the first result should have lastName "Adeyemi"

  Scenario: Search by email
    When searching for "folake.adeyemi@email.com"
    Then exactly one parent should be found

  Scenario: Search by phone number
    When searching for "+234 803 456 7890"
    Then at least one parent should be found

  Scenario: Search by child name
    When searching for "Janet Daniel"
    Then at least one parent should be found

  Scenario: Search by child admission number
    When searching for "AD9892434"
    Then at least one parent should be found

  Scenario: Search with no match
    When searching for "zzzznonexistent"
    Then no parents should be returned

  Scenario: Search is case-insensitive
    When searching for "EMEKA" and "emeka"
    Then both should return the same number of results

  # getParentStats

  Scenario: Retrieve aggregate parent statistics
    When getting parent stats
    Then totalParents should be 12
    And activeParents should be 12
    And inactiveParents should be 0
    And totalChildren should be greater than 0
    And totalOutstanding should be greater than 0
    And totalPaid should be greater than 0
    And collectionRate should be between 0 and 100

  Scenario: Total children sums all children across parents
    Given all parents
    When getting parent stats
    Then totalChildren should match the sum of all parent children counts

Feature: Fee record data access helpers
  As a developer working with mock fee data
  I want reliable fee record access functions
  So that fee information can be retrieved and queried

  # getAllFeeRecords

  Scenario: Retrieve all fee records
    When getting all fee records
    Then there should be at least one record

  Scenario: Each fee record has required fields
    Given all fee records
    Then each record should have id, parentId, childId, feeType, amount, paidAmount, balance, and status
    And balance should equal amount minus paidAmount

  # getFeeRecordById

  Scenario: Retrieve a fee record by valid ID
    Given the first fee record ID
    When getting a fee record by that ID
    Then the correct fee record should be returned

  Scenario: Retrieve a fee record by non-existent ID
    When getting a fee record by ID "nonexistent"
    Then undefined should be returned

  # getFeeRecordsByParentId

  Scenario: Retrieve fee records by parent ID
    When getting fee records for parent "parent-001"
    Then there should be at least one record
    And all records should belong to parent "parent-001"

  # getFeeRecordsByChildId

  Scenario: Retrieve fee records by child ID
    Given a known child ID from the first fee record
    When getting fee records for that child
    Then all records should belong to that child

  # getFeeRecordsByStatus

  Scenario: Retrieve paid fee records
    When getting fee records with "paid" status
    Then all records should have "paid" status

  Scenario: Retrieve overdue fee records
    When getting fee records with "overdue" status
    Then all records should have "overdue" status

  # getOverdueFeeRecords

  Scenario: Overdue helper matches status filter
    When getting overdue fee records via both methods
    Then both should return the same count

  # getFeeStats

  Scenario: Retrieve aggregate fee statistics
    When getting fee stats
    Then totalRecords should be greater than 0
    And totalFees should be greater than 0
    And totalCollected should be greater than or equal to 0
    And totalOutstanding should be greater than or equal to 0
    And collectionRate should be between 0 and 100
    And status counts should sum to total records

  # searchFeeRecords

  Scenario: Search fee records by parent name
    When searching fee records for "Emeka"
    Then at least one record should be found

  Scenario: Search fee records by fee type
    When searching fee records for "School Fees"
    Then all results should contain "school fees" in the fee type

  Scenario: Search fee records with no match
    When searching fee records for "zzzzz"
    Then no records should be returned

Feature: Related parent data access helpers
  As a developer working with parent-related data
  I want reliable access to payments, communications, and meetings
  So that related parent data can be retrieved correctly

  # getPaymentsByParentId

  Scenario: Retrieve payments for a known parent
    When getting payments for parent "parent-001"
    Then there should be at least one payment
    And all payments should belong to parent "parent-001"

  Scenario: Retrieve payments for an unknown parent
    When getting payments for parent "unknown"
    Then no payments should be returned

  # getCommunicationsByParentId

  Scenario: Retrieve communications for a known parent
    When getting communications for parent "parent-001"
    Then there should be at least one communication
    And all communications should belong to parent "parent-001"

  # getEventAttendanceByParentId

  Scenario: Retrieve event attendance for a known parent
    When getting event attendance for parent "parent-001"
    Then there should be at least one record
    And all records should belong to parent "parent-001"

  # getLibraryPaymentsByParentId

  Scenario: Retrieve library payments for a known parent
    When getting library payments for parent "parent-001"
    Then there should be at least one payment
    And all payments should belong to parent "parent-001"

  # getLeaveRequestsByParentId

  Scenario: Retrieve leave requests for a known parent
    When getting leave requests for parent "parent-001"
    Then there should be at least one request
    And all requests should belong to parent "parent-001"

  # updateLeaveRequestStatus

  Scenario: Update the status of a leave request
    Given a pending leave request for parent "parent-001"
    When updating the leave request status to "approved" by "Principal Adeyemi" with notes "Approved for family reasons"
    Then the updated request should have status "approved"
    And the processor should be "Principal Adeyemi"
    And the admin notes should be "Approved for family reasons"
    And the processedAt timestamp should be defined

  Scenario: Update a non-existent leave request
    When updating leave request "nonexistent" to "approved" by "Admin"
    Then undefined should be returned

  # getMeetingsByParentId

  Scenario: Retrieve meetings for a known parent
    When getting meetings for parent "parent-001"
    Then there should be at least one meeting
    And all meetings should belong to parent "parent-001"

  # getUpcomingMeetingsByParentId

  Scenario: Retrieve only upcoming meetings
    When getting upcoming meetings for parent "parent-001"
    Then all meetings should have "upcoming" status

  # getPastMeetingsByParentId

  Scenario: Retrieve only past (non-upcoming) meetings
    When getting past meetings for parent "parent-001"
    Then no meetings should have "upcoming" status

Feature: Fee reminder data access helpers
  As a developer working with fee reminder data
  I want reliable reminder access functions
  So that fee reminders can be retrieved and analyzed

  # getAllFeeReminders

  Scenario: Retrieve all fee reminders sorted by sentAt descending
    When getting all fee reminders
    Then there should be at least one reminder
    And they should be sorted by sentAt descending

  # getRemindersByParentId

  Scenario: Retrieve reminders for a specific parent
    Given a parent ID from the first reminder
    When getting reminders for that parent
    Then there should be at least one reminder
    And all reminders should belong to that parent

  # getReminderCountByParentId

  Scenario: Reminder count matches array length
    Given a parent ID from the first reminder
    When getting the count and the list of reminders
    Then the count should match the list length

  # getReminderStatsByParentId

  Scenario: Retrieve reminder stats with channel breakdown
    Given a parent ID from the first reminder
    When getting reminder stats for that parent
    Then total should be greater than zero
    And byChannel should include "email", "sms", "push", and "whatsapp"

  # getRemindersByFeeRecordId

  Scenario: Retrieve reminders for a specific fee record
    Given a fee record ID from the first reminder
    When getting reminders for that fee record
    Then there should be at least one reminder
    And all reminders should belong to that fee record

  # getReminderCountByFeeRecordId

  Scenario: Fee record reminder count matches array length
    Given a fee record ID from the first reminder
    When getting the count and the list of reminders for that fee record
    Then the count should match the list length
