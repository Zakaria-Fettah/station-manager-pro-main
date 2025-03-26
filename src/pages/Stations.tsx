
import { useState } from "react";
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
import { MapPin, Plus, Store } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Schema for station validation
const stationSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  nomStation: z.string().min(1, "Le nom de la station est requis"),
  adresseStation: z.string().min(1, "L'adresse est requise"),
  villeStation: z.string().min(1, "La ville est requise"),
  dateMiseEnService: z.date({
    required_error: "La date de mise en service est requise",
  }),
  latitude: z.coerce.number({
    required_error: "La latitude est requise",
    invalid_type_error: "La latitude doit être un nombre",
  }),
  longitude: z.coerce.number({
    required_error: "La longitude est requise",
    invalid_type_error: "La longitude doit être un nombre",
  }),
  telephone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("L'email doit être valide"),
  horairesOuverture: z.string().min(1, "Les horaires d'ouverture sont requis"),
  statut: z.string().min(1, "Le statut est requis"),
});

type Station = z.infer<typeof stationSchema>;

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "En maintenance" },
];

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([
    {
      id: "S001",
      nomStation: "Station Centrale",
      adresseStation: "123 Rue Principale",
      villeStation: "Casablanca",
      dateMiseEnService: new Date(2020, 0, 15),
      latitude: 33.5731,
      longitude: -7.5898,
      telephone: "0522123456",
      email: "centrale@stations.ma",
      horairesOuverture: "24/7",
      statut: "active",
    },
  ]);
  const [open, setOpen] = useState(false);

  const form = useForm<Station>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      id: "",
      nomStation: "",
      adresseStation: "",
      villeStation: "",
      telephone: "",
      email: "",
      horairesOuverture: "",
      statut: "",
    },
  });

  const onSubmit = (data: Station) => {
    setStations([...stations, data]);
    setOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Stations</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="success">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter Station
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle station</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle station.
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
                          <FormLabel>ID Station</FormLabel>
                          <FormControl>
                            <Input placeholder="S001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nomStation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de la Station</FormLabel>
                          <FormControl>
                            <Input placeholder="Station Centrale" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="adresseStation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue Principale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="villeStation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Casablanca" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateMiseEnService"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date Mise en Service</FormLabel>
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
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Sélectionner une date</span>
                                  )}
                                  <MapPin className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.000001" 
                              placeholder="33.5731" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.000001" 
                              placeholder="-7.5898" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="0522123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="station@exemple.ma" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="horairesOuverture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horaires d'ouverture</FormLabel>
                        <FormControl>
                          <Input placeholder="24/7 ou 8h-20h" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Date Mise en Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell className="font-medium">{station.id}</TableCell>
                  <TableCell>{station.nomStation}</TableCell>
                  <TableCell>{station.adresseStation}</TableCell>
                  <TableCell>{station.villeStation}</TableCell>
                  <TableCell>{format(station.dateMiseEnService, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        station.statut === "active" && "bg-green-100 text-green-800",
                        station.statut === "inactive" && "bg-red-100 text-red-800",
                        station.statut === "maintenance" && "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {station.statut === "active" && "Active"}
                      {station.statut === "inactive" && "Inactive"}
                      {station.statut === "maintenance" && "En maintenance"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="flex flex-col text-xs">
                      <span>{station.telephone}</span>
                      <span>{station.email}</span>
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Stations;
