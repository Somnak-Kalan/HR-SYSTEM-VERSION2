// import {
//   Checkbox,
//   Empty,
//   Spin,
// } from 'antd'
// import { modulePermissions } from '../data'

// const normalizeId = item => {
//   if (!item) return undefined

//   const value =
//     typeof item === 'object'
//       ? item._id ||
//         item.id ||
//         item.value ||
//         item.permissionId
//       : item

//   if (
//     value === undefined ||
//     value === null ||
//     value === ''
//   ) {
//     return undefined
//   }

//   return String(value)
// }

// const getName = item => {
//   if (!item) return ''

//   if (typeof item !== 'object') {
//     return String(item)
//   }

//   return (
//     item.system ||
//     item.name ||
//     item.title ||
//     item.label ||
//     item.detail ||
//     item.description ||
//     ''
//   )
// }

// const isApiDisabled = permission => {
//   return (
//     permission?.disabled === true ||
//     permission?.isDisabled === true
//   )
// }

// const isApiAssigned = permission => {
//   return (
//     permission?.assigned === true ||
//     permission?.isAssigned === true ||
//     permission?.checked === true ||
//     permission?.isChecked === true
//   )
// }

// const PermissionPanel = ({
//   groups,

//   selectedPermissions = [],
//   disabledPermissions = [],
//   onPermissionChange,
//   loading = false,

//   selectedModules = [],
//   disabledMap = {},
//   value = {},
//   onChange,
//   readonly = false,
// }) => {
//   const normalizedSelectedPermissions = [
//     ...new Set(
//       (selectedPermissions || [])
//         .map(normalizeId)
//         .filter(Boolean)
//     ),
//   ]

//   const normalizedDisabledPermissions = [
//     ...new Set(
//       (disabledPermissions || [])
//         .map(normalizeId)
//         .filter(Boolean)
//     ),
//   ]

//   const selectedPermissionSet = new Set(
//     normalizedSelectedPermissions
//   )

//   const disabledPermissionSet = new Set(
//     normalizedDisabledPermissions
//   )

//   const toggleApiPermission = (
//     permissionId,
//     checked
//   ) => {
//     const id = normalizeId(permissionId)

//     if (
//       !id ||
//       readonly ||
//       disabledPermissionSet.has(id)
//     ) {
//       return
//     }

//     const next = checked
//       ? [
//           ...normalizedSelectedPermissions,
//           id,
//         ]
//       : normalizedSelectedPermissions.filter(
//           item => item !== id
//         )

//     onPermissionChange?.([
//       ...new Set(next),
//     ])
//   }

//   if (Array.isArray(groups)) {
//     if (loading) {
//       return (
//         <div className="flex min-h-[180px] items-center justify-center rounded-md border">
//           <div className="text-center">
//             <Spin size="large" />

//             <div className="mt-3 text-sm text-gray-500">
//               Checking employee permissions...
//             </div>
//           </div>
//         </div>
//       )
//     }

//     if (!groups.length) {
//       return (
//         <div className="rounded-md border py-10">
//           <Empty description="No permission available" />
//         </div>
//       )
//     }

//     return (
//       <div className="rounded-md border px-7 py-7">
//         {disabledPermissionSet.size >
//           0 && (
//           <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
//             Checked and disabled permissions
//             are already assigned to this
//             employee.
//           </div>
//         )}

//         {groups.map(group => {
//           const permissions =
//             group.permissions ||
//             group.children ||
//             group.items ||
//             []

//           const groupTitle =
//             group.system ||
//             group.name ||
//             group.title ||
//             group.label ||
//             'Permission'

//           return (
//             <div
//               key={
//                 normalizeId(group) ||
//                 groupTitle
//               }
//               className="mb-7 last:mb-0"
//             >
//               <div className="mb-5 flex items-center gap-5">
//                 <div className="h-px w-20 bg-gray-100" />

//                 <h3 className="text-[18px] font-semibold text-gray-700">
//                   {groupTitle}
//                 </h3>

//                 <div className="h-px flex-1 bg-gray-100" />
//               </div>

//               <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
//                 {permissions.map(
//                   permission => {
//                     const id =
//                       normalizeId(permission)

//                     const apiAssigned =
//                       isApiAssigned(
//                         permission
//                       )

//                     const locked =
//                       readonly ||
//                       isApiDisabled(
//                         permission
//                       ) ||
//                       apiAssigned ||
//                       disabledPermissionSet.has(
//                         id
//                       )

//                     const checked =
//                       selectedPermissionSet.has(
//                         id
//                       ) ||
//                       disabledPermissionSet.has(
//                         id
//                       ) ||
//                       apiAssigned

//                     return (
//                       <Checkbox
//                         key={
//                           id ||
//                           getName(
//                             permission
//                           )
//                         }
//                         checked={checked}
//                         disabled={locked}
//                         onChange={event =>
//                           toggleApiPermission(
//                             id,
//                             event.target
//                               .checked
//                           )
//                         }
//                       >
//                         {getName(
//                           permission
//                         )}
//                       </Checkbox>
//                     )
//                   }
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   const togglePermission = (
//     moduleKey,
//     permission,
//     checked
//   ) => {
//     if (readonly) return

//     const oldList =
//       value[moduleKey] || []

//     const nextList = checked
//       ? [...oldList, permission]
//       : oldList.filter(
//           item => item !== permission
//         )

//     onChange?.({
//       ...value,
//       [moduleKey]: [
//         ...new Set(nextList),
//       ],
//     })
//   }

//   if (!selectedModules.length) {
//     return (
//       <div className="rounded-md border py-10">
//         <Empty description="No permission available" />
//       </div>
//     )
//   }

//   return (
//     <div className="rounded-md border px-7 py-7">
//       {selectedModules.map(moduleKey => {
//         const permissions =
//           modulePermissions[moduleKey] || []

//         const lockedList =
//           disabledMap[moduleKey] || []

//         const lockedSet = new Set(
//           lockedList.map(item =>
//             String(item)
//           )
//         )

//         const selectedSet = new Set(
//           (value[moduleKey] || []).map(
//             item => String(item)
//           )
//         )

//         return (
//           <div
//             key={moduleKey}
//             className="mb-7 last:mb-0"
//           >
//             <div className="mb-5 flex items-center gap-5">
//               <div className="h-px w-20 bg-gray-100" />

//               <h3 className="text-[18px] font-semibold capitalize text-gray-700">
//                 {moduleKey === 'it'
//                   ? 'IT Dev'
//                   : moduleKey}
//               </h3>

//               <div className="h-px flex-1 bg-gray-100" />
//             </div>

//             <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
//               {permissions.map(
//                 permission => {
//                   const permissionKey =
//                     String(permission)

//                   const isLocked =
//                     lockedSet.has(
//                       permissionKey
//                     )

//                   const locked =
//                     readonly ||
//                     isLocked

//                   const checked =
//                     selectedSet.has(
//                       permissionKey
//                     ) || isLocked

//                   return (
//                     <Checkbox
//                       key={permission}
//                       checked={checked}
//                       disabled={locked}
//                       onChange={event =>
//                         togglePermission(
//                           moduleKey,
//                           permission,
//                           event.target
//                             .checked
//                         )
//                       }
//                     >
//                       {permission}
//                     </Checkbox>
//                   )
//                 }
//               )}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default PermissionPanel
import { Checkbox, Empty, Spin } from 'antd';
import { modulePermissions } from '../data';

const normalizeId = (item) => {
  if (!item) return undefined;

  const value =
    typeof item === 'object' ? item._id || item.id || item.value || item.permissionId || item.permission_id : item;

  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return String(value);
};

const getName = (item) => {
  if (!item) return '';

  if (typeof item !== 'object') {
    return String(item);
  }

  return item.system || item.name || item.title || item.label || item.detail || item.description || '';
};

const isApiDisabled = (permission) => {
  return permission?.disabled === true || permission?.isDisabled === true;
};

const isApiAssigned = (permission) => {
  return (
    permission?.assigned === true ||
    permission?.isAssigned === true ||
    permission?.checked === true ||
    permission?.isChecked === true
  );
};

const PermissionPanel = ({
  groups,

  /*
   * Permissions belonging to the role currently
   * being created or edited.
   */
  selectedPermissions = [],

  /*
   * Permissions already owned by the selected employee.
   * These permissions are checked and disabled.
   */
  disabledPermissions = [],

  onPermissionChange,
  loading = false,

  selectedModules = [],
  disabledMap = {},
  value = {},
  onChange,
  readonly = false,
}) => {
  const normalizedSelectedPermissions = [...new Set((selectedPermissions || []).map(normalizeId).filter(Boolean))];

  const normalizedDisabledPermissions = [...new Set((disabledPermissions || []).map(normalizeId).filter(Boolean))];

  const selectedPermissionSet = new Set(normalizedSelectedPermissions);

  const disabledPermissionSet = new Set(normalizedDisabledPermissions);

  const toggleApiPermission = (permissionId, checked) => {
    const id = normalizeId(permissionId);

    if (!id || readonly || disabledPermissionSet.has(id)) {
      return;
    }

    const next = checked
      ? [...normalizedSelectedPermissions, id]
      : normalizedSelectedPermissions.filter((selectedId) => selectedId !== id);

    onPermissionChange?.([...new Set(next)]);
  };

  if (Array.isArray(groups)) {
    if (loading) {
      return (
        <div className="flex min-h-[180px] items-center justify-center rounded-md border">
          <div className="text-center">
            <Spin size="large" />

            <div className="mt-3 text-sm text-gray-500">Checking employee permissions...</div>
          </div>
        </div>
      );
    }

    if (!groups.length) {
      return (
        <div className="rounded-md border py-10">
          <Empty description="No permission available" />
        </div>
      );
    }

    return (
      <div className="rounded-md border px-7 py-7">
        {disabledPermissionSet.size > 0 && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Checked and disabled permissions are already assigned to this employee.
          </div>
        )}

        {groups.map((group) => {
          const permissions = group.permissions || group.children || group.items || [];

          const groupTitle = group.system || group.name || group.title || group.label || 'Permission';

          return (
            <div key={normalizeId(group) || groupTitle} className="mb-7 last:mb-0">
              <div className="mb-5 flex items-center gap-5">
                <div className="h-px w-20 bg-gray-100" />

                <h3 className="text-[18px] font-semibold text-gray-700">{groupTitle}</h3>

                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
                {permissions.map((permission) => {
                  const id = normalizeId(permission);

                  const assignedByOptionApi = isApiAssigned(permission);

                  const alreadyOwnedByEmployee = disabledPermissionSet.has(id);

                  const selectedInCurrentRole = selectedPermissionSet.has(id);

                  /*
                   * Existing employee permissions are
                   * disabled during both create and edit.
                   */
                  const locked = readonly || isApiDisabled(permission) || assignedByOptionApi || alreadyOwnedByEmployee;

                  /*
                   * A permission is checked when:
                   *
                   * 1. It belongs to the current role.
                   * 2. The employee already owns it.
                   * 3. The permission-options API marks it assigned.
                   */
                  const checked = selectedInCurrentRole || alreadyOwnedByEmployee || assignedByOptionApi;

                  return (
                    <Checkbox
                      key={id || getName(permission)}
                      checked={checked}
                      disabled={locked}
                      onChange={(event) => toggleApiPermission(id, event.target.checked)}>
                      {getName(permission)}
                    </Checkbox>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const togglePermission = (moduleKey, permission, checked) => {
    if (readonly) return;

    const oldList = value[moduleKey] || [];

    const nextList = checked ? [...oldList, permission] : oldList.filter((item) => item !== permission);

    onChange?.({
      ...value,
      [moduleKey]: [...new Set(nextList)],
    });
  };

  if (!selectedModules.length) {
    return (
      <div className="rounded-md border py-10">
        <Empty description="No permission available" />
      </div>
    );
  }

  return (
    <div className="rounded-md border px-7 py-7">
      {selectedModules.map((moduleKey) => {
        const permissions = modulePermissions[moduleKey] || [];

        const lockedList = disabledMap[moduleKey] || [];

        const lockedSet = new Set(lockedList.map((item) => String(item)));

        const selectedSet = new Set((value[moduleKey] || []).map((item) => String(item)));

        return (
          <div key={moduleKey} className="mb-7 last:mb-0">
            <div className="mb-5 flex items-center gap-5">
              <div className="h-px w-20 bg-gray-100" />

              <h3 className="text-[18px] font-semibold capitalize text-gray-700">
                {moduleKey === 'it' ? 'IT Dev' : moduleKey}
              </h3>

              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
              {permissions.map((permission) => {
                const permissionKey = String(permission);

                const isLocked = lockedSet.has(permissionKey);

                const locked = readonly || isLocked;

                const checked = selectedSet.has(permissionKey) || isLocked;

                return (
                  <Checkbox
                    key={permission}
                    checked={checked}
                    disabled={locked}
                    onChange={(event) => togglePermission(moduleKey, permission, event.target.checked)}>
                    {permission}
                  </Checkbox>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionPanel;
