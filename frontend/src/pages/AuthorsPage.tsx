// src/pages/AuthorsPage.tsx
import { useEffect, useRef, useState } from "react";
import { authorsApi } from "../api/authorsApi";
import { getErrorMessage } from "../api/http";
import type { AuthorCreateRequest, AuthorResponse, AuthorType } from "../types/author";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

export default function AuthorsPage() {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<AuthorResponse[]>([]);

  // Dialog form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AuthorResponse | null>(null);

  const [form, setForm] = useState<AuthorCreateRequest>({
    authorType: "PERSON",
    fullName: "",
    email: "",
    organizationName: "",
    contactEmail: "",
  });

  async function load() {
    setLoading(true);
    try {
      const data = await authorsApi.list();
      setAuthors(data);
    } catch (e: unknown) {
  toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
}
 finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm({
      authorType: "PERSON",
      fullName: "",
      email: "",
      organizationName: "",
      contactEmail: "",
    });
    setShowForm(true);
  }

  function openEdit(a: AuthorResponse) {
    // IMPORTANTE: tu backend NO permite cambiar authorType en UPDATE
    setEditing(a);
    setForm({
      authorType: a.authorType,
      fullName: a.fullName ?? "",
      email: a.email ?? "",
      organizationName: a.organizationName ?? "",
      contactEmail: a.contactEmail ?? "",
    });
    setShowForm(true);
  }

  async function save() {
    try {
      if (editing) {
        // PUT /authors/{id}
        await authorsApi.update(editing.id, form);
        toast.current?.show({ severity: "success", summary: "OK", detail: "Autor actualizado" });
      } else {
        // POST /authors
        await authorsApi.create(form);
        toast.current?.show({ severity: "success", summary: "OK", detail: "Autor creado" });
      }
      setShowForm(false);
      await load();
    } catch (e: unknown) {
  toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
}

  }

  function askDelete(a: AuthorResponse) {
    confirmDialog({
      message: `¿Eliminar autor id=${a.id}?`,
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await authorsApi.remove(a.id);
          toast.current?.show({ severity: "success", summary: "OK", detail: "Autor eliminado" });
          await load();
        } catch (e: unknown) {
  toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
}

      },
    });
  }

  const authorTypeOptions = [
    { label: "PERSON", value: "PERSON" as AuthorType },
    { label: "ORG", value: "ORG" as AuthorType },
  ];

  const nameBody = (a: AuthorResponse) =>
    a.authorType === "PERSON" ? a.fullName : a.organizationName;

  const emailBody = (a: AuthorResponse) =>
    a.authorType === "PERSON" ? a.email : a.contactEmail;

  const actionsBody = (a: AuthorResponse) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => openEdit(a)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => askDelete(a)} />
    </div>
  );

  const isPerson = form.authorType === "PERSON";

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Autores</h2>
        <Button label="Nuevo autor" icon="pi pi-plus" onClick={openCreate} />
      </div>

      <DataTable value={authors} loading={loading} paginator rows={10} responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "90px" }} />
        <Column field="authorType" header="Tipo" style={{ width: "140px" }} />
        <Column header="Nombre" body={nameBody} />
        <Column header="Email" body={emailBody} />
        <Column header="Acciones" body={actionsBody} style={{ width: "160px" }} />
      </DataTable>

      <Dialog
        header={editing ? `Editar autor #${editing.id}` : "Crear autor"}
        visible={showForm}
        style={{ width: "520px", maxWidth: "95vw" }}
        modal
        onHide={() => setShowForm(false)}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-2">authorType</label>
            <Dropdown
              value={form.authorType}
              options={authorTypeOptions}
              onChange={(e) => setForm((p) => ({ ...p, authorType: e.value }))}
              disabled={!!editing} // NO permitir cambiar tipo en UPDATE
              className="w-full"
              placeholder="Seleccione tipo"
            />
            {editing && (
              <small className="text-500">
                *En tu backend no se permite cambiar authorType en UPDATE.
              </small>
            )}
          </div>

          {isPerson ? (
            <>
              <div>
                <label className="block mb-2">fullName</label>
                <InputText
                  value={form.fullName ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label className="block mb-2">email</label>
                <InputText
                  value={form.email ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full"
                  placeholder="Ej: juan@mail.com"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block mb-2">organizationName</label>
                <InputText
                  value={form.organizationName ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, organizationName: e.target.value }))}
                  className="w-full"
                  placeholder="Ej: Editorial XYZ"
                />
              </div>
              <div>
                <label className="block mb-2">contactEmail</label>
                <InputText
                  value={form.contactEmail ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full"
                  placeholder="Ej: contacto@xyz.com"
                />
              </div>
            </>
          )}

          <div className="flex justify-content-end gap-2 mt-2">
            <Button label="Cancelar" severity="secondary" onClick={() => setShowForm(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={save} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
