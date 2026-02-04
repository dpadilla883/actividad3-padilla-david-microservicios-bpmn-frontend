// src/pages/PublicationsPage.tsx
import { useEffect, useRef, useState } from "react";
import { publicationsApi } from "../api/publicationsApi";
import { authorsApi } from "../api/authorsApi";
import { getErrorMessage } from "../api/http";
import type { AuthorResponse } from "../types/author";
import type {
  PublicationCreateRequest,
  PublicationResponse,
  PublicationUpdateRequest,
} from "../types/publication";
import { getNextStatuses, STATUSES } from "../utils/editorialStatus";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

export default function PublicationsPage() {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(false);
  const [pubs, setPubs] = useState<PublicationResponse[]>([]);
  const [authors, setAuthors] = useState<AuthorResponse[]>([]);

  // filtros
  const [filterAuthorId, setFilterAuthorId] = useState<number | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  // form create/edit
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PublicationResponse | null>(null);

  const [form, setForm] = useState<PublicationCreateRequest>({
    publicationType: "ARTICLE",
    authorId: 0,
    title: "",
    content: "",
    category: "",
  });

  // detalle + status
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState<PublicationResponse | null>(null);
  const [nextStatus, setNextStatus] = useState<string>("");

  async function loadAuthors() {
    try {
      const data = await authorsApi.list();
      setAuthors(data);
    } catch {
      // Si falla Authors, igual puedes usar authorId manual, pero avisamos
      toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail: "No se pudo cargar lista de autores (puedes escribir authorId manualmente).",
      });
    }
  }

  async function loadPubs() {
    setLoading(true);
    try {
      const data = await publicationsApi.list({
        authorId: filterAuthorId,
        status: filterStatus,
      });
      setPubs(data);
    } catch (e: unknown) {
      toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuthors();
    loadPubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAuthorId, filterStatus]);

  function openCreate() {
    setEditing(null);
    setForm({
      publicationType: "ARTICLE",
      authorId: 0,
      title: "",
      content: "",
      category: "",
    });
    setShowForm(true);
  }

  function openEdit(p: PublicationResponse) {
    setEditing(p);
    setForm({
      publicationType: p.publicationType ?? "ARTICLE",
      authorId: p.authorId,
      title: p.title,
      content: p.content ?? "",
      category: p.category ?? "",
    });
    setShowForm(true);
  }

  async function save() {
    try {
      if (editing) {
        const payload: PublicationUpdateRequest = { ...form };
        await publicationsApi.update(editing.id, payload);
        toast.current?.show({ severity: "success", summary: "OK", detail: "Publicación actualizada" });
      } else {
        await publicationsApi.create(form);
        toast.current?.show({ severity: "success", summary: "OK", detail: "Publicación creada" });
      }
      setShowForm(false);
      await loadPubs();
    } catch (e: unknown) {
      toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
    }
  }

  function askDelete(p: PublicationResponse) {
    confirmDialog({
      message: `¿Eliminar publicación id=${p.id}?`,
      header: "Confirmar",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await publicationsApi.remove(p.id);
          toast.current?.show({ severity: "success", summary: "OK", detail: "Publicación eliminada" });
          await loadPubs();
        } catch (e: unknown) {
          toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
        }
      },
    });
  }

  async function openDetails(p: PublicationResponse) {
    try {
      const full = await publicationsApi.getById(p.id);
      setDetail(full);
      // preselecciona primer estado posible
      const next = getNextStatuses(full.status)[0] ?? "";
      setNextStatus(next);
      setShowDetail(true);
    } catch (e: unknown) {
      toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
    }
  }

  async function changeStatus() {
    if (!detail) return;
    if (!nextStatus) {
      toast.current?.show({ severity: "warn", summary: "Aviso", detail: "No hay transición disponible." });
      return;
    }
    try {
      const updated = await publicationsApi.changeStatus(detail.id, nextStatus);
      setDetail(updated);
      const next = getNextStatuses(updated.status)[0] ?? "";
      setNextStatus(next);
      toast.current?.show({ severity: "success", summary: "OK", detail: `Estado cambiado a ${updated.status}` });
      await loadPubs();
    } catch (e: unknown) {
      toast.current?.show({ severity: "error", summary: "Error", detail: getErrorMessage(e) });
    }
  }

  const statusBody = (p: PublicationResponse) => <Tag value={p.status} />;

  const authorLabel = (a: AuthorResponse) =>
    a.authorType === "PERSON" ? `${a.id} - ${a.fullName}` : `${a.id} - ${a.organizationName}`;

  const authorOptions = authors.map((a) => ({ label: authorLabel(a), value: a.id }));

  const actionsBody = (p: PublicationResponse) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" rounded text onClick={() => openDetails(p)} />
      <Button icon="pi pi-pencil" rounded text onClick={() => openEdit(p)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => askDelete(p)} />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Publicaciones</h2>
        <Button label="Nueva publicación" icon="pi pi-plus" onClick={openCreate} />
      </div>

      {/* Filtros */}
      <div className="grid mb-3">
        <div className="col-12 md:col-6">
          <label className="block mb-2">Filtrar por autor</label>
          <Dropdown
            value={filterAuthorId ?? null}
            options={[{ label: "Todos", value: null }, ...authorOptions]}
            onChange={(e) => setFilterAuthorId(e.value ?? undefined)}
            className="w-full"
            placeholder="Todos"
            showClear
          />
        </div>
        <div className="col-12 md:col-6">
          <label className="block mb-2">Filtrar por status</label>
          <Dropdown
            value={filterStatus ?? null}
            options={[{ label: "Todos", value: null }, ...STATUSES.map((s) => ({ label: s, value: s }))]}
            onChange={(e) => setFilterStatus(e.value ?? undefined)}
            className="w-full"
            placeholder="Todos"
            showClear
          />
        </div>
      </div>

      <DataTable value={pubs} loading={loading} paginator rows={10} responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "90px" }} />
        <Column field="title" header="Título" />
        <Column field="authorId" header="AuthorId" style={{ width: "120px" }} />
        <Column header="Estado" body={statusBody} style={{ width: "170px" }} />
        <Column header="Acciones" body={actionsBody} style={{ width: "200px" }} />
      </DataTable>

      {/* Dialog crear/editar */}
      <Dialog
        header={editing ? `Editar publicación #${editing.id}` : "Crear publicación"}
        visible={showForm}
        style={{ width: "620px", maxWidth: "95vw" }}
        modal
        onHide={() => setShowForm(false)}
      >
        <div className="flex flex-column gap-3">
          <div>
            <label className="block mb-2">publicationType</label>
            <InputText value={form.publicationType} disabled className="w-full" />
            <small className="text-500">*Tu backend solo acepta ARTICLE por ahora.</small>
          </div>

          <div>
            <label className="block mb-2">authorId</label>
            {/* Si Authors está cargado, dropdown; si no, puedes escribir manual */}
            {authors.length > 0 ? (
              <Dropdown
                value={form.authorId || null}
                options={authorOptions}
                onChange={(e) => setForm((p) => ({ ...p, authorId: e.value }))}
                className="w-full"
                placeholder="Seleccione autor"
              />
            ) : (
              <InputText
                value={String(form.authorId || "")}
                onChange={(e) => setForm((p) => ({ ...p, authorId: Number(e.target.value) }))}
                className="w-full"
                placeholder="Ej: 1"
              />
            )}
          </div>

          <div>
            <label className="block mb-2">title</label>
            <InputText
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">category (opcional)</label>
            <InputText
              value={form.category ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-2">content (opcional)</label>
            <InputTextarea
              value={form.content ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              className="w-full"
              rows={5}
            />
          </div>

          <div className="flex justify-content-end gap-2 mt-2">
            <Button label="Cancelar" severity="secondary" onClick={() => setShowForm(false)} />
            <Button label="Guardar" icon="pi pi-check" onClick={save} />
          </div>
        </div>
      </Dialog>

      {/* Dialog detalle + cambio de estado */}
      <Dialog
        header={detail ? `Detalle publicación #${detail.id}` : "Detalle"}
        visible={showDetail}
        style={{ width: "680px", maxWidth: "95vw" }}
        modal
        onHide={() => setShowDetail(false)}
      >
        {detail && (
          <div className="flex flex-column gap-2">
            <div><b>Título:</b> {detail.title}</div>
            <div><b>Estado:</b> <Tag value={detail.status} /></div>
            <div><b>AuthorId:</b> {detail.authorId}</div>

            <div className="mt-2">
              <b>Autor (enriquecido):</b>
              {detail.author ? (
                <div className="mt-1 p-2 border-1 surface-border border-round">
                  <div><b>Tipo:</b> {detail.author.authorType}</div>
                  <div><b>Nombre/Org:</b> {detail.author.fullName ?? detail.author.organizationName}</div>
                  <div><b>Email:</b> {detail.author.email ?? detail.author.contactEmail}</div>
                </div>
              ) : (
                <div className="text-500">No disponible (Authors no respondió o no existe).</div>
              )}
            </div>

            <div className="mt-3">
              <label className="block mb-2"><b>Cambiar estado</b></label>
              <div className="flex gap-2 align-items-center">
                <Dropdown
                  value={nextStatus || null}
                  options={getNextStatuses(detail.status).map((s) => ({ label: s, value: s }))}
                  onChange={(e) => setNextStatus(e.value)}
                  placeholder="Seleccione"
                  className="w-full"
                  disabled={getNextStatuses(detail.status).length === 0}
                />
                <Button
                  label="Aplicar"
                  icon="pi pi-refresh"
                  onClick={changeStatus}
                  disabled={!nextStatus}
                />
              </div>
              {getNextStatuses(detail.status).length === 0 && (
                <small className="text-500">*No hay transiciones disponibles desde {detail.status}.</small>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
