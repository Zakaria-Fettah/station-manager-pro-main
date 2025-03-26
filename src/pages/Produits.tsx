
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types
interface Produit {
  _id: string;
  id: string;
  nomProduit: string;
  type: string;
  dateAjout: string;
  unite: string;
}

interface ProduitFormData {
  id: string;
  nomProduit: string;
  type: string;
  dateAjout: string;
  unite: string;
}

// API endpoints
const API_URL = "http://localhost:5000/api/produits";

// Fetch all produits
const fetchProduits = async (): Promise<Produit[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

const Produits = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduit, setCurrentProduit] = useState<Produit | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProduitFormData>();
  const queryClient = useQueryClient();

  // Fetch produits
  const { data: produits = [], isLoading } = useQuery({
    queryKey: ["produits"],
    queryFn: fetchProduits
  });

  // Add produit mutation
  const addProduitMutation = useMutation({
    mutationFn: (newProduit: ProduitFormData) => axios.post(API_URL, newProduit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      setIsAddDialogOpen(false);
      reset();
      toast.success("Produit ajouté avec succès");
    },
    onError: (error) => {
      console.error("Error adding produit:", error);
      toast.error("Erreur lors de l'ajout du produit");
    }
  });

  // Update produit mutation
  const updateProduitMutation = useMutation({
    mutationFn: (updatedProduit: ProduitFormData) => 
      axios.put(`${API_URL}/${updatedProduit.id}`, updatedProduit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      setIsEditDialogOpen(false);
      toast.success("Produit mis à jour avec succès");
    },
    onError: (error) => {
      console.error("Error updating produit:", error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  });

  // Delete produit mutation
  const deleteProduitMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      setIsDeleteDialogOpen(false);
      toast.success("Produit supprimé avec succès");
    },
    onError: (error) => {
      console.error("Error deleting produit:", error);
      toast.error("Erreur lors de la suppression du produit");
    }
  });

  const onAddSubmit = (data: ProduitFormData) => {
    addProduitMutation.mutate(data);
  };

  const onEditSubmit = (data: ProduitFormData) => {
    updateProduitMutation.mutate(data);
  };

  const handleDelete = () => {
    if (currentProduit) {
      deleteProduitMutation.mutate(currentProduit.id);
    }
  };

  const openEditDialog = (produit: Produit) => {
    setCurrentProduit(produit);
    setValue("id", produit.id);
    setValue("nomProduit", produit.nomProduit);
    setValue("type", produit.type);
    setValue("dateAjout", new Date(produit.dateAjout).toISOString().split('T')[0]);
    setValue("unite", produit.unite);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (produit: Produit) => {
    setCurrentProduit(produit);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <Button
            onClick={() => {
              reset();
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center">Chargement des produits...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom du produit</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <div className="flex flex-col items-center justify-center gap-1 p-4 text-muted-foreground">
                        <Package className="h-8 w-8" />
                        <div>Aucun produit trouvé</div>
                        <Button 
                          variant="link" 
                          onClick={() => setIsAddDialogOpen(true)}
                        >
                          Ajouter un produit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  produits.map((produit) => (
                    <TableRow key={produit._id}>
                      <TableCell>{produit.id}</TableCell>
                      <TableCell>{produit.nomProduit}</TableCell>
                      <TableCell>{produit.type}</TableCell>
                      <TableCell>
                        {format(new Date(produit.dateAjout), 'dd MMMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>{produit.unite}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(produit)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(produit)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Add Produit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un produit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID du produit</Label>
                    <Input
                      id="id"
                      {...register("id", { required: "L'ID est requis" })}
                    />
                    {errors.id && (
                      <p className="text-sm text-destructive">{errors.id.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomProduit">Nom du produit</Label>
                    <Input
                      id="nomProduit"
                      {...register("nomProduit", { required: "Le nom est requis" })}
                    />
                    {errors.nomProduit && (
                      <p className="text-sm text-destructive">{errors.nomProduit.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      {...register("type", { required: "Le type est requis" })}
                    />
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateAjout">Date d'ajout</Label>
                    <Input
                      id="dateAjout"
                      type="date"
                      {...register("dateAjout", { required: "La date est requise" })}
                    />
                    {errors.dateAjout && (
                      <p className="text-sm text-destructive">{errors.dateAjout.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unite">Unité</Label>
                  <Input
                    id="unite"
                    {...register("unite", { required: "L'unité est requise" })}
                  />
                  {errors.unite && (
                    <p className="text-sm text-destructive">{errors.unite.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Produit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier un produit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID du produit</Label>
                    <Input
                      id="id"
                      {...register("id", { required: "L'ID est requis" })}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomProduit">Nom du produit</Label>
                    <Input
                      id="nomProduit"
                      {...register("nomProduit", { required: "Le nom est requis" })}
                    />
                    {errors.nomProduit && (
                      <p className="text-sm text-destructive">{errors.nomProduit.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      {...register("type", { required: "Le type est requis" })}
                    />
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateAjout">Date d'ajout</Label>
                    <Input
                      id="dateAjout"
                      type="date"
                      {...register("dateAjout", { required: "La date est requise" })}
                    />
                    {errors.dateAjout && (
                      <p className="text-sm text-destructive">{errors.dateAjout.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unite">Unité</Label>
                  <Input
                    id="unite"
                    {...register("unite", { required: "L'unité est requise" })}
                  />
                  {errors.unite && (
                    <p className="text-sm text-destructive">{errors.unite.message}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Sauvegarder</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le produit "{currentProduit?.nomProduit}" ? 
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Produits;
