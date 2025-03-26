
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Schema for planning validation
const planningSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  semaine: z.number().min(1).max(53, "La semaine doit être entre 1 et 53"),
  jour: z.string().min(1, "Le jour est requis"),
  heureDebut: z.string().min(1, "L'heure de début est requise"),
  heureFin: z.string().min(1, "L'heure de fin est requise"),
  annee: z.number().min(2000).max(2100, "L'année doit être valide"),
  employeeId: z.string().optional(),
});

type Planning = z.infer<typeof planningSchema>;

const daysOfWeek = [
  { value: "lundi", label: "Lundi" },
  { value: "mardi", label: "Mardi" },
  { value: "mercredi", label: "Mercredi" },
  { value: "jeudi", label: "Jeudi" },
  { value: "vendredi", label: "Vendredi" },
  { value: "samedi", label: "Samedi" },
  { value: "dimanche", label: "Dimanche" },
];

const Planning = () => {
  const [plannings, setPlannings] = useState<Planning[]>([
    {
      id: "P001",
      semaine: 32,
      jour: "lundi",
      heureDebut: "08:00",
      heureFin: "16:00",
      annee: 2024,
      employeeId: "EMP001",
    },
    {
      id: "P002",
      semaine: 32,
      jour: "mardi",
      heureDebut: "09:00",
      heureFin: "17:00",
      annee: 2024,
      employeeId: "EMP002",
    },
  ]);
  const [open, setOpen] = useState(false);

  const form = useForm<Planning>({
    resolver: zodResolver(planningSchema),
    defaultValues: {
      id: "",
      semaine: 1,
      jour: "",
      heureDebut: "",
      heureFin: "",
      annee: new Date().getFullYear(),
    },
  });

  const onSubmit = (data: Planning) => {
    setPlannings([...plannings, data]);
    setOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Planning</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="success">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Planning
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau planning</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un planning hebdomadaire.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Planning</FormLabel>
                          <FormControl>
                            <Input placeholder="P001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employé (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="ID Employé" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="semaine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semaine</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="53"
                              placeholder="1-53"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="annee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value || <span>Sélectionner une année</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date.getFullYear());
                                  }
                                }}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="jour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jour</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un jour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="heureDebut"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de début</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="heureFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de fin</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter className="sticky bottom-0 pt-4 bg-background">
                    <Button type="submit" variant="success">Enregistrer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Semaine</TableHead>
                <TableHead>Jour</TableHead>
                <TableHead>Heures</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Employé</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plannings.map((planning) => (
                <TableRow key={planning.id}>
                  <TableCell className="font-medium">{planning.id}</TableCell>
                  <TableCell>{planning.semaine}</TableCell>
                  <TableCell className="capitalize">{planning.jour}</TableCell>
                  <TableCell>
                    {planning.heureDebut} - {planning.heureFin}
                  </TableCell>
                  <TableCell>{planning.annee}</TableCell>
                  <TableCell>{planning.employeeId || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Planning;
