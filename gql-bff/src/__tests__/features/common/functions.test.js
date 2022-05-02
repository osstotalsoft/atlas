const { userCanSeeResource, userCanEditResource, getTenantIdFromDescription, filterResourcesByTenant } = require("../../../features/common/functions");

describe("Functions should work as expected", () => {
  it.each([
    {
      resTenantId: null,
      ctxTenantId: "A",
      role: "global_admin",
      expectedCanSee: true,
      expectedCanEdit: true,
    },
    {
      resTenantId: "A",
      ctxTenantId: "A",
      role: "global_admin",
      expectedCanSee: true,
      expectedCanEdit: true,
    },
    {
      resTenantId: "A",
      ctxTenantId: "B",
      role: "global_admin",
      expectedCanSee: false,
      expectedCanEdit: false,
    },
    {
      resTenantId: null,
      ctxTenantId: "B",
      role: "tenant_admin",
      expectedCanSee: true,
      expectedCanEdit: false,
    },
    {
      resTenantId: "A",
      ctxTenantId: "A",
      role: "tenant_admin",
      expectedCanSee: true,
      expectedCanEdit: true,
    },
    {
      resTenantId: "A",
      ctxTenantId: "B",
      role: "tenant_admin",
      expectedCanSee: false,
      expectedCanEdit: false,
    },
    {
      resTenantId: null,
      ctxTenantId: "B",
      role: "tenant_user",
      expectedCanSee: true,
      expectedCanEdit: false,
    },
    {
      resTenantId: "A",
      ctxTenantId: "A",
      role: "tenant_user",
      expectedCanSee: true,
      expectedCanEdit: false,
    },
    {
      resTenantId: "A",
      ctxTenantId: "B",
      role: "tenant_user",
      expectedCanSee: false,
      expectedCanEdit: false,
    },
    {
      resTenantId: "A",
      ctxTenantId: "A",
      role: ["tenant_user", "global_admin"],
      expectedCanSee: true,
      expectedCanEdit: true,
    },
  ])(
    "Resource Tenant: {$resTenantId}, context tenant: {$ctxTenantId} roles: {$role}. User should see and edit as expected",
    ({ resTenantId, ctxTenantId, role, expectedCanSee, expectedCanEdit }) => {
      const externalUser = { role, tenantId: ctxTenantId };

      const canSee = userCanSeeResource(resTenantId, externalUser?.tenantId);
      const canEdit = userCanEditResource(resTenantId, externalUser);

      expect(canSee).toBe(expectedCanSee);
      expect(canEdit).toBe(expectedCanEdit);
    }
  );

  it.each([
    {
      description:
        '{"description":"this is a resource description","tenantId":null}',
    },
    {
      description: '{"description":"this is a resource description"}',
    },
    {
      description: undefined,
    },
    {
      description: null,
    },
  ])(
    "Should return null or undefined for this definition: $definition",
    (description) => {
      const res = { description };

      const tenantId = getTenantIdFromDescription(res?.description);
      expect(tenantId).toBeFalsy();
    }
  );

  it("Should return the correct tenantId from resource description", () => {
    const res = {
      description:
        '{"description":"this is a resource description","tenantId":"tA"}',
    };

    const tenantId = getTenantIdFromDescription(res?.description);
    expect(tenantId).toBe("tA");
  });

  it("Should filter the resources list by user's tenant", () => {
    const resourceList = [
      {
        description: undefined,
      },
      {
        description: null,
      },
      {
        description:
          '{"description":"this is a resource description","tenantId":null}',
      },
      {
        description:
          '{"description":"this is a resource description","tenantId":"tA"}',
      },
      {
        description:
          '{"description":"this is a resource description","tenantId":"tB"}',
      },
    ];

    const expectedList = [
      {
        description: undefined,
      },
      {
        description: null,
      },
      {
        description:
          '{"description":"this is a resource description","tenantId":null}',
      },
      {
        description:
          '{"description":"this is a resource description","tenantId":"tA"}',
      },
    ];

    const result = filterResourcesByTenant(resourceList, "tA");
    expect(result).toEqual(expectedList);
  });
});
