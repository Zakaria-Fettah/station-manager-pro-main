
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Truck, Edit, Trash2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_ROUTES } from "@/config/api";

interface Fournisseur {
  id: string;
  nomFournisseur: string;
  adresseFournisseur: string;
  telephoneFournisseur: string;
  emailFournisseur: string;
  ville: string;
  contact: string;
}

const Fournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFournisseur, setCurrentFournisseur] = useState<Fournisseur | null>(null);
  const { toast } = useToast();
  
  const form = useForm<Fournisseur>({
    defaultValues: {
      id: "",
      nomFournisseur: "",
      adresseFournisseur: "",
      telephoneFournisseur: "",
      emailFournisseur: "",
      ville: "",
      contact: ""
    }
  });

  const fetchFournisseurs = async () => {
    try {
      const response = await fetch(API_ROUTES.fournisseurs);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des fournisseurs');
      }
      const data = await response.json();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fournisseurs",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const onSubmit = async (data: Fournisseur) => {
    try {
      const url = isEditing
        ? `${API_ROUTES.fournisseurs}/${currentFournisseur?.id}`
        : API_ROUTES.fournisseurs;
      
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

      fetchFournisseurs();
      setOpen(false);
      form.reset();
      
      toast({
        title: "Succès",
        description: isEditing 
          ? "Fournisseur mis à jour avec succès" 
          : "Nouveau fournisseur ajouté avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le fournisseur",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (fournisseur: Fournisseur) => {
    setCurrentFournisseur(fournisseur);
    setIsEditing(true);
    form.reset({
      id: fournisseur.id,
      nomFournisseur: fournisseur.nomFournisseur,
      adresseFournisseur: fournisseur.adresseFournisseur,
      telephoneFournisseur: fournisseur.telephoneFournisseur,
      emailFournisseur: fournisseur.emailFournisseur,
      ville: fournisseur.ville,
      contact: fournisseur.contact
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur?')) {
      try {
        const response = await fetch(`${API_ROUTES.fournisseurs}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        fetchFournisseurs();
        toast({
          title: "Succès",
          description: "Fournisseur supprimé avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le fournisseur",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setIsEditing(false);
      setCurrentFournisseur(null);
    }
    setOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Fournisseurs</h1>
          <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Nouveau Fournisseur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les détails du fournisseur ci-dessous
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID du fournisseur</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ID du fournisseur (ex: F001)" 
                            {...field} 
                            disabled={isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Rest of form fields */}
                  <FormField
                    control={form.control}
                    name="nomFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du fournisseur</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adresseFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Adresse du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephoneFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Téléphone du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailFournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email du fournisseur" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ville"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact (personne)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de la personne à contacter" {...field} />
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
            <TableCaption>Liste des fournisseurs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fournisseurs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Truck size={48} className="mb-2 opacity-30" />
                      <p>Aucun fournisseur trouvé</p>
                      <p className="text-sm">Commencez par ajouter un nouveau fournisseur</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                fournisseurs.map((fournisseur) => (
                  <TableRow key={fournisseur.id}>
                    <TableCell>{fournisseur.id}</TableCell>
                    <TableCell>{fournisseur.nomFournisseur}</TableCell>
                    <TableCell>{fournisseur.adresseFournisseur}</TableCell>
                    <TableCell>{fournisseur.telephoneFournisseur}</TableCell>
                    <TableCell>{fournisseur.emailFournisseur}</TableCell>
                    <TableCell>{fournisseur.ville}</TableCell>
                    <TableCell>{fournisseur.contact}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(fournisseur)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(fournisseur.id)}
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

export default Fournisseurs;
