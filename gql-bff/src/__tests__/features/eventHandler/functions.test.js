const {
  updateHandlerCondition,
  filterEvHandlersByTenant,
} = require("../../../features/eventHandler/functions");

describe("EventHandler functions must work as expected", () => {
  it.each([
    {
      initialCond: "param1 === true",
      isMultitenant: true,
      tenantId: "68a448a2-e7d8-4875-8127-f18668217eb6",
      expectedCond: `\$.Headers.TenantId === '68a448a2-e7d8-4875-8127-f18668217eb6' && param1 === true`,
    },
    {
      initialCond: "",
      isMultitenant: true,
      tenantId: "68a448a2-e7d8-4875-8127-f18668217eb6",
      expectedCond: `\$.Headers.TenantId === '68a448a2-e7d8-4875-8127-f18668217eb6'`,
    },
    {
      initialCond: "param1 === true",
      isMultitenant: false,
      tenantId: null,
      expectedCond: `param1 === true`,
    },
  ])(
    "Should return the expected output composed by the tenant condition concatenated with the initial condition",
    ({ initialCond, isMultitenant, tenantId, expectedCond }) => {
      const res = updateHandlerCondition(initialCond, isMultitenant, tenantId);
      expect(res).toEqual(expectedCond);
    }
  );

  it("Should filter the list by tenant id", () => {
    const resourceList = [
      {
        condition:
          "$.Headers.TenantId === '68a448a2-e7d8-4875-8127-f18668217eb6' && param1 === true",
      },
      {
        condition: "$.Headers.TenantId === '111' && param1 === true",
      },
      { condition: "param1 === true" },
    ];

    const expectedList = [
      {
        condition:
          "$.Headers.TenantId === '68a448a2-e7d8-4875-8127-f18668217eb6' && param1 === true",
      },
      {
        condition: "param1 === true",
      },
    ];

    const result = filterEvHandlersByTenant(
      resourceList,
      "68a448a2-e7d8-4875-8127-f18668217eb6"
    );
    expect(result).toEqual(expectedList);
  });
});
