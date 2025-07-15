let superAdminPermission = [
    "productCategoryList", "productCategoryActiveList",
    "productList", "productActiveList", "productListLimit", "productAdd", "productUpdate", "productDelete", "productStatus", "productDetails",
];



let getRouterPermissionList = async (id = 0) => {
    return new Promise((resolve, reject) => {
        if (id === 1) resolve(superAdminPermission);
        else if (id === 2) resolve(systemUserPermission);
        else resolve([]);
    });
}

module.exports = {
    getRouterPermissionList
}