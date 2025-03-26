
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Database, Edit, Trash2, Plus, Container } from "lucide-react";
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

interface Citerne {
  id: string;
  capacite: number;
  dateInstallation: string;
  typeCarburant: string;
  statut: string;
}

const Citernes = () => {
  const [citernes, setCiternes] = useState<Citerne[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCiterne, setCurrentCiterne] = useState<Citerne | null>(null);
  const { toast } = useToast();
  
  const form = useForm<Citerne>({
    defaultValues: {
      id: "",
      capacite: 0,
      dateInstallation: new Date().toISOString().split('T')[0],
      typeCarburant: "essence",
      statut: "en service"
    }
  });

  const fetchCiternes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/citernes');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des citernes');
      }
      const data = await response.json();
      setCiternes(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les citernes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCiternes();
  }, []);

  const onSubmit = async (data: Citerne) => {
    try {
      const url = isEditing
        ? `http://localhost:5000/api/citernes/${currentCiterne?.id}`
        : 'http://localhost:5000/api/citernes';
      
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

      fetchCiternes();
      setOpen(false);
      form.reset();
      
      toast({
        title: "Succès",
        description: isEditing 
          ? "Citerne mise à jour avec succès" 
          : "Nouvelle citerne ajoutée avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la citerne",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (citerne: Citerne) => {
    setCurrentCiterne(citerne);
    setIsEditing(true);
    form.reset({
      id: citerne.id,
      capacite: citerne.capacite,
      dateInstallation: new Date(citerne.dateInstallation).toISOString().split('T')[0],
      typeCarburant: citerne.typeCarburant,
      statut: citerne.statut
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette citerne?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/citernes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        fetchCiternes();
        toast({
          title: "Succès",
          description: "Citerne supprimée avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la citerne",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setIsEditing(false);
      setCurrentCiterne(null);
    }
    setOpen(open);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Citernes</h1>
          <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Nouvelle Citerne
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier la citerne" : "Ajouter une citerne"}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les détails de la citerne ci-dessous
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de la citerne</FormLabel>
                        <FormControl>
                          <Input placeholder="ID de la citerne" {...field} disabled={isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacité (litres)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Capacité en litres"
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
                    name="dateInstallation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'installation</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="typeCarburant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de carburant</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="essence">Essence</option>
                            <option value="diesel">Diesel</option>
                            <option value="gpl">GPL</option>
                            <option value="bioéthanol">Bioéthanol</option>
                            <option value="superéthanol">Superéthanol</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            {...field}
                          >
                            <option value="en service">En service</option>
                            <option value="hors service">Hors service</option>
                            <option value="en maintenance">En maintenance</option>
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
            <TableCaption>Liste des citernes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Capacité (L)</TableHead>
                <TableHead>Date d'installation</TableHead>
                <TableHead>Type de carburant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citernes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Container size={48} className="mb-2 opacity-30" />
                      <p>Aucune citerne trouvée</p>
                      <p className="text-sm">Commencez par ajouter une nouvelle citerne</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                citernes.map((citerne) => (
                  <TableRow key={citerne.id}>
                    <TableCell>{citerne.id}</TableCell>
                    <TableCell>{citerne.capacite}</TableCell>
                    <TableCell>
                      {format(new Date(citerne.dateInstallation), 'dd MMMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="capitalize">{citerne.typeCarburant}</TableCell>
                    <TableCell className="capitalize">{citerne.statut}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(citerne)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(citerne.id)}
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

export default Citernes;
