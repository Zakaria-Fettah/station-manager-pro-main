
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ShoppingCart, Edit, Trash2, Plus, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Vente {
  id: string;
  quantiteVente: number;
  dateVente: string;
  modePaiement: string;
}

const Ventes = () => {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVente, setCurrentVente] = useState<Vente | null>(null);
  const { toast } = useToast();
  
  const form = useForm<Vente>({
    defaultValues: {
      id: "",
      quantiteVente: 0,
      dateVente: new Date().toISOString().split('T')[0],
      modePaiement: "espèces"
    }
  });

  const fetchVentes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ventes');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des ventes');
      }
      const data = await response.json();
      setVentes(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ventes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVentes();
  }, []);

  const onSubmit = async (data: Vente) => {
    try {
      const url = isEditing
        ? `http://localhost:5000/api/ventes/${currentVente?.id}`
        : 'http://localhost:5000/api/ventes';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement');
      }

      fetchVentes();
      setOpen(false);
      form.reset();
      
      toast({
        title: "Succès",
        description: isEditing 
          ? "Vente mise à jour avec succès" 
          : "Nouvelle vente ajoutée avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la vente",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vente: Vente) => {
    setCurrentVente(vente);
    setIsEditing(true);
    form.reset({
      id: vente.id,
      quantiteVente: vente.quantiteVente,
      dateVente: new Date(vente.dateVente).toISOString().split('T')[0],
      modePaiement: vente.modePaiement
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/ventes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        fetchVentes();
        toast({
          title: "Succès",
          description: "Vente supprimée avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la vente",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setIsEditing(false);
      setCurrentVente(null);
    }
    setOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Ventes</h1>
          <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Nouvelle Vente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier la vente" : "Ajouter une vente"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les détails de la vente ci-dessous
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de la vente</FormLabel>
                        <FormControl>
                          <Input placeholder="ID de la vente" {...field} disabled={isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantiteVente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantité vendue</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Quantité vendue"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateVente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de la vente</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modePaiement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mode de paiement</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="espèces">Espèces</option>
                            <option value="carte bancaire">Carte bancaire</option>
                            <option value="chèque">Chèque</option>
                            <option value="virement">Virement</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <DialogFooter className="sticky bottom-0 pt-2 bg-background">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  variant="success" 
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isEditing ? "Mettre à jour" : "Enregistrer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <Table>
            <TableCaption>Liste des ventes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Date de vente</TableHead>
                <TableHead>Mode de paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Receipt size={48} className="mb-2 opacity-30" />
                      <p>Aucune vente trouvée</p>
                      <p className="text-sm">Commencez par ajouter une nouvelle vente</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ventes.map((vente) => (
                  <TableRow key={vente.id}>
                    <TableCell>{vente.id}</TableCell>
                    <TableCell>{vente.quantiteVente}</TableCell>
                    <TableCell>
                      {format(new Date(vente.dateVente), 'dd MMMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="capitalize">{vente.modePaiement}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(vente)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vente.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Ventes;
