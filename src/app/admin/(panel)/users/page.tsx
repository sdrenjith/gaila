import { createAdminUserAction, updateAdminUserAction } from "@/app/actions/admin";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminPageFrame } from "@/components/admin/AdminPageFrame";
import { Field, Panel, Select } from "@/components/admin/AdminFields";
import { getAdminUsers } from "@/lib/admin-data";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <AdminPageFrame>
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Manage users</h1>
        <p className="mt-2 text-stone-500">Create admin/editor accounts and safely update existing access.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">
        <Panel title="Create user">
          <ActionForm action={createAdminUserAction} className="grid gap-4" submitLabel="Create user">
            <Field label="Name" name="name" />
            <Field label="Email" name="email" type="email" />
            <Field label="Password" name="password" type="password" />
          </ActionForm>
        </Panel>
        <Panel title="Users">
          <div className="grid gap-3">
            {users.map((user) => (
              <ActionForm
                key={user._id}
                action={updateAdminUserAction}
                className="grid gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm"
                submitLabel="Save user"
              >
                <input type="hidden" name="id" value={user._id} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" name="name" defaultValue={user.name} />
                  <Field label="Email" name="email" type="email" defaultValue={user.email} />
                  <Select
                    label="Role"
                    name="role"
                    defaultValue={user.role}
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Editor", value: "editor" },
                    ]}
                  />
                  <Select
                    label="Status"
                    name="status"
                    defaultValue={user.status}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Disabled", value: "disabled" },
                    ]}
                  />
                  <Field
                    label="New password"
                    name="password"
                    type="password"
                    required={false}
                    hint="Leave blank to keep the existing password."
                  />
                </div>
                <p className="text-xs text-stone-500">
                  Last login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"}
                </p>
              </ActionForm>
            ))}
          </div>
        </Panel>
      </div>
    </AdminPageFrame>
  );
}
