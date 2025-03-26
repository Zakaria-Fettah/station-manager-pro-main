
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { 
  KeyRound, 
  ShieldCheck, 
  User, 
  Globe, 
  Sun, 
  Moon, 
  Save,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

// Password form schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Le mot de passe actuel doit contenir au moins 6 caractères.",
  }),
  newPassword: z.string().min(6, {
    message: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
  }),
  confirmPassword: z.string().min(6, {
    message: "La confirmation du mot de passe doit contenir au moins 6 caractères.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

// Personal info form schema
const personalInfoFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Adresse email invalide.",
  }),
  phone: z.string().optional(),
  position: z.string().optional(),
});

const Settings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [dateFormat, setDateFormat] = useState("dd-mm-yyyy");
  const [reducedAnimations, setReducedAnimations] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [selectedThemeColor, setSelectedThemeColor] = useState("blue");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedLanguage = localStorage.getItem("language") || "fr";
    const savedDateFormat = localStorage.getItem("dateFormat") || "dd-mm-yyyy";
    const savedReducedAnimations = localStorage.getItem("reducedAnimations") === "true";
    const savedTwoFactorEnabled = localStorage.getItem("twoFactorEnabled") === "true";
    const savedLoginNotifications = localStorage.getItem("loginNotifications") !== "false"; // Default to true
    const savedThemeColor = localStorage.getItem("themeColor") || "blue";

    setDarkMode(savedDarkMode);
    setLanguage(savedLanguage);
    setDateFormat(savedDateFormat);
    setReducedAnimations(savedReducedAnimations);
    setTwoFactorEnabled(savedTwoFactorEnabled);
    setLoginNotifications(savedLoginNotifications);
    setSelectedThemeColor(savedThemeColor);

    // Apply dark mode to the document body
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Personal info form
  const personalInfoForm = useForm<z.infer<typeof personalInfoFormSchema>>({
    resolver: zodResolver(personalInfoFormSchema),
    defaultValues: {
      fullName: user?.displayName || "",
      email: user?.email || "",
      phone: "",
      position: "",
    },
  });

  // Load user data
  useEffect(() => {
    if (user) {
      // In a real application, you might load more detailed user info from API
      personalInfoForm.setValue("fullName", user.displayName || "");
      personalInfoForm.setValue("email", user.email || "");
    }
  }, [user, personalInfoForm]);

  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    console.log("Password change data:", data);

    // In a real application, you would send this to an API endpoint
    // For now, simulate success
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
    });
    passwordForm.reset();
  };

  const onPersonalInfoSubmit = (data: z.infer<typeof personalInfoFormSchema>) => {
    console.log("Personal info update data:", data);

    // In a real application, you would send this to an API endpoint
    // For now, simulate success
    toast({
      title: "Informations mises à jour",
      description: "Vos informations personnelles ont été mises à jour avec succès.",
    });
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    
    // Apply or remove dark mode class from document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: newDarkMode ? "Mode sombre activé" : "Mode clair activé",
      description: newDarkMode 
        ? "L'interface utilisateur est maintenant en mode sombre." 
        : "L'interface utilisateur est maintenant en mode clair.",
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    
    toast({
      title: "Langue mise à jour",
      description: `La langue d'affichage a été changée.`,
    });
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value);
    localStorage.setItem("dateFormat", value);
    
    toast({
      title: "Format de date mis à jour",
      description: `Le format de date a été changé.`,
    });
  };

  const toggleReducedAnimations = () => {
    const newValue = !reducedAnimations;
    setReducedAnimations(newValue);
    localStorage.setItem("reducedAnimations", String(newValue));
    
    // Apply reduced animations class
    if (newValue) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    
    toast({
      title: newValue ? "Animations réduites activées" : "Animations normales activées",
      description: newValue 
        ? "Les animations sont maintenant réduites." 
        : "Les animations sont maintenant normales.",
    });
  };

  const toggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    localStorage.setItem("twoFactorEnabled", String(newValue));
    
    toast({
      title: newValue ? "2FA activé" : "2FA désactivé",
      description: newValue 
        ? "L'authentification à deux facteurs est maintenant activée." 
        : "L'authentification à deux facteurs est maintenant désactivée.",
    });
  };

  const toggleLoginNotifications = () => {
    const newValue = !loginNotifications;
    setLoginNotifications(newValue);
    localStorage.setItem("loginNotifications", String(newValue));
    
    toast({
      title: newValue ? "Notifications activées" : "Notifications désactivées",
      description: newValue 
        ? "Les notifications de connexion sont maintenant activées." 
        : "Les notifications de connexion sont maintenant désactivées.",
    });
  };

  const setThemeColor = (color: string) => {
    setSelectedThemeColor(color);
    localStorage.setItem("themeColor", color);
    
    // In a real app, you would apply the theme color to the app
    // For now, just show a toast
    toast({
      title: "Couleur du thème mise à jour",
      description: `La couleur principale du thème a été changée.`,
    });
  };

  const handleManageSessions = () => {
    toast({
      title: "Gestion des sessions",
      description: "Cette fonctionnalité sera disponible prochainement.",
    });
  };

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <Navigation />
      <main className="md:ml-64 p-6">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 flex flex-wrap md:flex-nowrap w-full">
            <TabsTrigger value="password" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span>Mot de passe</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Sécurité</span>
            </TabsTrigger>
            <TabsTrigger value="personal-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Informations personnelles</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Langue</span>
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Thème</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe pour sécuriser votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe actuel</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Mettre à jour le mot de passe</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du compte</CardTitle>
                <CardDescription>
                  Gérez les paramètres de sécurité de votre compte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-sm font-medium">Authentification à deux facteurs</h3>
                    <p className="text-sm text-muted-foreground">
                      Ajoute une couche de sécurité supplémentaire à votre compte.
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={toggleTwoFactor}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h3 className="text-sm font-medium">Notifications de connexion</h3>
                    <p className="text-sm text-muted-foreground">
                      Recevez des alertes lors de nouvelles connexions à votre compte.
                    </p>
                  </div>
                  <Switch 
                    checked={loginNotifications}
                    onCheckedChange={toggleLoginNotifications}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h3 className="text-sm font-medium">Sessions actives</h3>
                    <p className="text-sm text-muted-foreground">
                      Gérez vos sessions de connexion actives.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleManageSessions}>
                    Gérer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Personal Info Tab */}
          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...personalInfoForm}>
                  <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 6 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Poste</FormLabel>
                          <FormControl>
                            <Input placeholder="Directeur de station" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Sauvegarder les modifications</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Language Tab */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de langue</CardTitle>
                <CardDescription>
                  Changez la langue d'affichage de l'application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="language">Langue d'affichage</Label>
                    <Select 
                      value={language} 
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="language" className="mt-1">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      Cette option change la langue d'affichage de l'interface utilisateur.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Label htmlFor="date-format">Format de date</Label>
                    <Select 
                      value={dateFormat} 
                      onValueChange={handleDateFormatChange}
                    >
                      <SelectTrigger id="date-format" className="mt-1">
                        <SelectValue placeholder="Sélectionnez un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="yyyy-mm-dd">AAAA/MM/JJ</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-2">
                      Définit le format d'affichage des dates dans l'application.
                    </p>
                  </div>
                </div>
                
                <Button onClick={() => {
                  toast({
                    title: "Paramètres de langue appliqués",
                    description: "Les paramètres de langue ont été enregistrés avec succès.",
                  });
                }}>
                  Appliquer les changements
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Theme Tab */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Thème d'affichage</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'interface utilisateur.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-sm font-medium">Mode sombre</h3>
                    <p className="text-sm text-muted-foreground">
                      Activer le mode sombre pour réduire la fatigue oculaire.
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={toggleTheme} 
                  />
                </div>
                
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <h3 className="text-sm font-medium">Animations réduites</h3>
                    <p className="text-sm text-muted-foreground">
                      Réduire les animations pour améliorer les performances.
                    </p>
                  </div>
                  <Switch 
                    checked={reducedAnimations}
                    onCheckedChange={toggleReducedAnimations}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 pt-3 border-t">
                  <Label className="mb-2">Couleur principale</Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { color: 'blue', class: 'bg-blue-500' },
                      { color: 'green', class: 'bg-green-500' },
                      { color: 'red', class: 'bg-red-500' },
                      { color: 'purple', class: 'bg-purple-500' },
                      { color: 'orange', class: 'bg-orange-500' }
                    ].map((theme) => (
                      <button
                        key={theme.color}
                        className={`w-10 h-10 rounded-full shadow-sm ${theme.class} cursor-pointer border-2 ${
                          selectedThemeColor === theme.color 
                            ? 'border-primary ring-2 ring-primary ring-offset-2' 
                            : 'border-transparent'
                        } hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                        aria-label={`Thème couleur ${theme.color}`}
                        onClick={() => setThemeColor(theme.color)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Label component needed for the form
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium text-foreground ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

export default Settings;
