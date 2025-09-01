let _setCurrentTenant = null;

export const setSetCurrentTenant = (setter) => {
    _setCurrentTenant = setter;
};

export const setCurrentTenantExternal = (tenant) => {
    if (_setCurrentTenant) {
        _setCurrentTenant(tenant);
    } else {
        console.warn("setCurrentTenantExternal called before context initialized.");
    }
};
