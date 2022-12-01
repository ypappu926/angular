import { Constants } from "src/app/CommoUtils/constants";

export class CommonUserList {

    //  Currenly Not in Use
    /**
     * 
     * @param roleId 
     * @returns 
     */
    static getRoleWiseTabList(roleId): any {
        let x = null;
        switch (roleId) {
            case Constants.UserRoleList.SUPER_ADMIN.id:
                x = [{ id: 1, name: 'All User', isSingleAddButton: 'hide', title: '' }, { id: 2, name: 'Bank Partner', isSingleAddButton: true, title: 'Bank Partner HO will upload Borrower Details' }, { id: 3, name: 'Admin User', isSingleAddButton: true, title: 'Admin maker and Admin Checker Details' }, { id: 4, name: 'Field Inspection Officer', isSingleAddButton: false, title: 'TAICO And DIC Field Inspection Details' }, { id: 5, name: 'Lead Bank Manager', isSingleAddButton: false, title: 'Lead Manger Details' }, { id: 6, name: 'General Manager', isSingleAddButton: false, title: 'General Manager Details' }];
                break;
            case Constants.UserRoleList.ADMIN_MAKER.id:
                x = [{ id: 1, name: 'Branch manager', isSingleAddButton: true, title: 'Branch Manager Details' }];
                break;
            case Constants.UserRoleList.ADMIN_CHECKER.id:
                x = [{ id: 1, name: 'Branch manager', isSingleAddButton: true, title: 'Branch Manager Details' }];
                break;
            case Constants.UserRoleList.BRANCH_MANAGER.id:
                x = [{ id: 4, name: 'Field Inspection Officers', isSingleAddButton: true, title: 'TIIC Field Inspection Details' }];
                break;
            default:
                break;
        }
        return x;
    }

    //  Currenly Not in Use
    /**
     * 
     * @param userRoleId 
     * @param tabId 
     * @returns 
     */
    static getTabWiseRoleIdList(userRoleId, tabId): string {
        let x = null;
        switch (userRoleId) {
            case Constants.UserRoleList.SUPER_ADMIN.id:
                switch (tabId) {
                    case 1:
                        x = "2,3,6,8,10,11"; // All Users
                        break;
                    case 2:
                        x = "6"; // HO
                        break;
                    case 3:
                        x = "2,3"; // Admin Maker/ Admin Checker
                        break;
                    case 4:
                        x = "8"; // (TAICO/DIC) Field Inspection Officers
                        break;
                    case 5:
                        x = "10"; // Lead Bank Managers (LBM)
                        break;
                    case 6:
                        x = "11"; // General Managers (GM)
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.ADMIN_MAKER.id:
                switch (tabId) {
                    case 1:
                        x = "2,3,4,8"; // All User
                        break;
                    case 3:
                        x = "2,3"; // Admin Maker/ Admin Checker
                        break;
                    case 4:
                        x = "8"; // (TAICO/DIC) Field Inspection Officers
                        break;
                    case 7:
                        x = "4"; // Branch Manager
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.ADMIN_CHECKER.id:
                switch (tabId) {
                    case 1:
                        x = "2,3,4,8"; // All User
                        break;
                    case 3:
                        x = "2,3"; // Admin Maker/ Admin Checker
                        break;
                    case 4:
                        x = "8"; // (TAICO/DIC) Field Inspection Officers
                        break;
                    case 7:
                        x = "4"; // Branch Manager
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.BRANCH_MANAGER.id:
                switch (tabId) {
                    case 4:
                        x = "8"; // Field Inspection Officers
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return x;
    }

    /**
     * 
     * @param authUserRoleId 
     * @param userListRoleId 
     * @returns 
     */
    static getSingleTabIdFromUserListRole(authUserRoleId: any, userListRoleId: any): number {
        let tabId: number;
        switch (authUserRoleId) {
            case Constants.UserRoleList.SUPER_ADMIN.id:
                switch (userListRoleId) {
                    case Constants.UserRoleList.BANK_HO.id:
                        tabId = 2;
                        break;
                    case Constants.UserRoleList.ADMIN_MAKER.id:
                        tabId = 3;
                        break;
                    case Constants.UserRoleList.ADMIN_MAKER.id:
                        tabId = 3;
                        break;
                    case Constants.UserRoleList.FIELD_INSPECTION_OFFICER.id:
                        tabId = 4;
                        break;
                    case Constants.UserRoleList.LEAD_BANK_MANAGER.id:
                        tabId = 5;
                        break;
                    case Constants.UserRoleList.GENERAL_MANAGER.id:
                        tabId = 6;
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.ADMIN_MAKER.id:
                switch (userListRoleId) {
                    case 4:
                        tabId = 7;
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.ADMIN_CHECKER.id:
                switch (userListRoleId) {
                    case 4:
                        tabId = 7;
                        break;
                    default:
                        break;
                }
                break;
            case Constants.UserRoleList.BRANCH_MANAGER.id:
                switch (userListRoleId) {
                    case 8:
                        tabId = 4;
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return tabId;
    }

    //  Currenly Not in Use
    /**
     * 
     * @param authUserRoleId 
     * @param tabId 
     * @returns 
     */
    static getDropDownLoadListBy(authUserRoleId, tabId): any {
        let x = null;
        switch (authUserRoleId) {
            case Constants.UserRoleList.SUPER_ADMIN.id:
                switch (tabId) {
                    case 1:
                        x = [{ id: 2, name: 'Admin Maker' }, { id: 3, name: 'Admin Checker' }, { id: 6, name: 'Bank HO' }, { id: 8, name: 'Field Inspection Officers' }, { id: 10, name: 'Lead Bank Managers' }, { id: 11, name: 'General Managers' }]
                        break;
                    case 3:
                        x = [{ id: 2, name: 'Admin Maker' }, { id: 3, name: 'Admin Checker' }];
                        break;
                    default:
                        x = [];
                        break;
                }
                break;
            // case Constants.UserRoleList.ADMIN_MAKER.id:
            //     x = [{ id: 1, name: 'Branch manager' }];
            //     break;
            default:
                x = [];
                break;
        }
        return x;
    }
}
