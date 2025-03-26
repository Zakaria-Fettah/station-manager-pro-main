import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Pencil, Trash, Calendar, User, Mail, Phone, MapPin, Flag, IdCard, FileText, Shield } from "lucide-react";

interface Employee {
  _id?: string;
  id?: string;
  id_employee?: string;
  cin: string;
  nom: string;
  prenom: string;
  name?: string;
  email: string;
  telephone: string;
  phone?: string;
  genre: string;
  dateNaissance: string;
  adresse: string;
  nationalite: string;
  status: string;
  cnss: string;
  typeContrat: string;
  position: string;
}

const API_URL = "http://localhost:5000/api/employees";

const Employees = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    cin: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    genre: "",
    dateNaissance: "",
    adresse: "",
    nationalite: "",
    status: "Actif",
    cnss: "",
    typeContrat: "",
    position: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedData = data.map((emp: any) => ({
        ...emp,
        nom: emp.nom || (emp.name ? emp.name.split(' ')[0] : ''),
        prenom: emp.prenom || (emp.name ? emp.name.split(' ')[1] || '' : ''),
        telephone: emp.telephone || emp.phone || '',
        id: emp.id || emp._id || '',
        cin: emp.cin || '',
        genre: emp.genre || 'Homme',
        dateNaissance: emp.dateNaissance || '',
        adresse: emp.adresse || '',
        nationalite: emp.nationalite || 'Marocaine',
        status: emp.status || 'Actif',
        cnss: emp.cnss || '',
        typeContrat: emp.typeContrat || '',
      }));
      
      setEmployees(formattedData);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les employés. Utilisation des données de démonstration.",
        variant: "destructive",
      });
      
      setEmployees([
        { 
          id: "EMP001", 
          cin: "AB123456", 
          nom: "Benali", 
          prenom: "Ahmed", 
          email: "ahmed@example.com", 
          telephone: "0600112233", 
          genre: "Homme",
          dateNaissance: "1985-05-15",
          adresse: "123 Rue Mohammed V, Casablanca",
          nationalite: "Marocaine",
          status: "Actif",
          cnss: "123456789",
          typeContrat: "CDI",
          position: "Manager" 
        },
        { 
          id: "EMP002", 
          cin: "CD789012", 
          nom: "Zahra", 
          prenom: "Fatima", 
          email: "fatima@example.com", 
          telephone: "0611223344", 
          genre: "Femme",
          dateNaissance: "1990-08-20",
          adresse: "45 Avenue Hassan II, Rabat",
          nationalite: "Marocaine",
          status: "Actif",
          cnss: "987654321",
          typeContrat: "CDD",
          position: "Caissier" 
        },
        { 
          id: "EMP003", 
          cin: "EF345678", 
          nom: "Mokhtar", 
          prenom: "Younes", 
          email: "younes@example.com", 
          telephone: "0622334455", 
          genre: "Homme",
          dateNaissance: "1988-12-10",
          adresse: "78 Boulevard Zerktouni, Marrakech",
          nationalite: "Marocaine",
          status: "En congé",
          cnss: "456789123",
          typeContrat: "CDI",
          position: "Pompiste" 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddDialog = () => {
    setFormData({
      id: `EMP${String(Date.now()).substring(7, 13)}`,
      cin: "",
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      genre: "Homme",
      dateNaissance: "",
      adresse: "",
      nationalite: "Marocaine",
      status: "Actif",
      cnss: "",
      typeContrat: "CDI",
      position: ""
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setFormData({
      id: employee.id || employee._id || "",
      cin: employee.cin || "",
      nom: employee.nom || "",
      prenom: employee.prenom || "",
      email: employee.email || "",
      telephone: employee.telephone || employee.phone || "",
      genre: employee.genre || "Homme",
      dateNaissance: employee.dateNaissance ? new Date(employee.dateNaissance).toISOString().split('T')[0] : "",
      adresse: employee.adresse || "",
      nationalite: employee.nationalite || "Marocaine",
      status: employee.status || "Actif",
      cnss: employee.cnss || "",
      typeContrat: employee.typeContrat || "CDI",
      position: employee.position || ""
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const addEmployee = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !formData.cin || !formData.position) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const employeeData = {
      ...formData,
      name: `${formData.nom} ${formData.prenom}`,
      phone: formData.telephone,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const savedEmployee = await response.json();
      setEmployees([...employees, savedEmployee]);
      setIsAddDialogOpen(false);
      toast({
        title: "Succès",
        description: "Employé ajouté avec succès.",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'employé.",
        variant: "destructive",
      });
    }
  };

  const editEmployee = async () => {
    if (!currentEmployee || !formData.nom || !formData.prenom || !formData.email || !formData.cin || !formData.position) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const employeeData = {
      ...formData,
      name: `${formData.nom} ${formData.prenom}`,
      phone: formData.telephone,
    };

    try {
      const id = currentEmployee._id || currentEmployee.id;
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedEmployee = await response.json();
      setEmployees(employees.map(emp => 
        (emp._id === id || emp.id === id) ? updatedEmployee : emp
      ));
      
      setIsEditDialogOpen(false);
      toast({
        title: "Succès",
        description: "Employé modifié avec succès.",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'employé.",
        variant: "destructive",
      });
    }
  };

  const deleteEmployee = async () => {
    if (!currentEmployee) return;

    try {
      const id = currentEmployee._id || currentEmployee.id;
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEmployees(employees.filter(emp => emp._id !== id && emp.id !== id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Succès",
        description: "Employé supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'employé.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Employés</h1>
          <Button onClick={openAddDialog} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Ajouter un employé
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>CIN</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Chargement des employés...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Aucun employé trouvé. Ajoutez votre premier employé en cliquant sur le bouton ci-dessus.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee._id || employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.cin}</TableCell>
                    <TableCell>{employee.nom}</TableCell>
                    <TableCell>{employee.prenom}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.telephone || employee.phone}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded-full text-xs inline-block 
                        ${employee.status === 'Actif' ? 'bg-green-100 text-green-800' : 
                          employee.status === 'Inactif' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {employee.status || 'Actif'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => openDeleteDialog(employee)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="id" className="flex items-center gap-1">
                    <IdCard className="h-4 w-4" /> ID Employé*
                  </Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="EMP001"
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cin" className="flex items-center gap-1">
                    <IdCard className="h-4 w-4" /> CIN*
                  </Label>
                  <Input
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                    placeholder="AB123456"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nom" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Nom*
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Nom"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="prenom" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Prénom*
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    placeholder="Prénom"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email*
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telephone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Téléphone
                  </Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="0600000000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="genre" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Genre*
                  </Label>
                  <Select name="genre" value={formData.genre} onValueChange={(value) => handleSelectChange('genre', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateNaissance" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Date de naissance*
                  </Label>
                  <Input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adresse" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Adresse
                  </Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nationalite" className="flex items-center gap-1">
                    <Flag className="h-4 w-4" /> Nationalité
                  </Label>
                  <Input
                    id="nationalite"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleInputChange}
                    placeholder="Nationalité"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Status
                  </Label>
                  <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cnss" className="flex items-center gap-1">
                    <Shield className="h-4 w-4" /> CNSS
                  </Label>
                  <Input
                    id="cnss"
                    name="cnss"
                    value={formData.cnss}
                    onChange={handleInputChange}
                    placeholder="Numéro CNSS"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="typeContrat" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Type de contrat
                  </Label>
                  <Select name="typeContrat" value={formData.typeContrat} onValueChange={(value) => handleSelectChange('typeContrat', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                      <SelectItem value="Intérimaire">Intérimaire</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Poste*
                  </Label>
                  <Select name="position" value={formData.position} onValueChange={(value) => handleSelectChange('position', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Caissier">Caissier</SelectItem>
                      <SelectItem value="Pompiste">Pompiste</SelectItem>
                      <SelectItem value="Administratif">Administratif</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-background py-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={addEmployee} className="bg-green-600 hover:bg-green-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'employé</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-id" className="flex items-center gap-1">
                    <IdCard className="h-4 w-4" /> ID Employé*
                  </Label>
                  <Input
                    id="edit-id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cin" className="flex items-center gap-1">
                    <IdCard className="h-4 w-4" /> CIN*
                  </Label>
                  <Input
                    id="edit-cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-nom" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Nom*
                  </Label>
                  <Input
                    id="edit-nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-prenom" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Prénom*
                  </Label>
                  <Input
                    id="edit-prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" /> Email*
                  </Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-telephone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" /> Téléphone
                  </Label>
                  <Input
                    id="edit-telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-genre" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Genre*
                  </Label>
                  <Select name="genre" value={formData.genre} onValueChange={(value) => handleSelectChange('genre', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Homme">Homme</SelectItem>
                      <SelectItem value="Femme">Femme</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dateNaissance" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Date de naissance*
                  </Label>
                  <Input
                    id="edit-dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-adresse" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Adresse
                  </Label>
                  <Input
                    id="edit-adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-nationalite" className="flex items-center gap-1">
                    <Flag className="h-4 w-4" /> Nationalité
                  </Label>
                  <Input
                    id="edit-nationalite"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Status
                  </Label>
                  <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cnss" className="flex items-center gap-1">
                    <Shield className="h-4 w-4" /> CNSS
                  </Label>
                  <Input
                    id="edit-cnss"
                    name="cnss"
                    value={formData.cnss}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-typeContrat" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Type de contrat
                  </Label>
                  <Select name="typeContrat" value={formData.typeContrat} onValueChange={(value) => handleSelectChange('typeContrat', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Stagiaire">Stagiaire</SelectItem>
                      <SelectItem value="Intérimaire">Intérimaire</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-position" className="flex items-center gap-1">
                    <User className="h-4 w-4" /> Poste*
                  </Label>
                  <Select name="position" value={formData.position} onValueChange={(value) => handleSelectChange('position', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Caissier">Caissier</SelectItem>
                      <SelectItem value="Pompiste">Pompiste</SelectItem>
                      <SelectItem value="Administratif">Administratif</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4 sticky bottom-0 bg-background py-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={editEmployee} className="bg-green-600 hover:bg-green-700">
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Supprimer l'employé</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Êtes-vous sûr de vouloir supprimer cet employé ? Cette action ne peut pas être annulée.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={deleteEmployee}
              >
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Employees;
