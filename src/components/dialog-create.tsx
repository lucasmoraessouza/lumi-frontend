import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { httpClient } from "@/services/httpClient";

export function DialogCreate({
  disabled,
  fetch,
}: {
  disabled?: boolean;
  fetch: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSendFile() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.info("Selecione um arquivo PDF.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      await httpClient.post("/energy-bill/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetch();
      toast.success("Arquivo enviado com sucesso!");
      setOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Erro ao enviar arquivo:", err);
      toast.error(
        err.response?.data?.message ||
          "Erro ao enviar o arquivo. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Nova consulta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar nova conta de energia</DialogTitle>
          <DialogDescription>
            Selecione abaixo o arquivo PDF da conta de energia e clique em
            enviar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="pdf"
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSendFile} disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
