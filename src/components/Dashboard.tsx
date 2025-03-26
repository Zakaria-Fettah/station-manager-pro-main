
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Droplets, Users, Calendar, TruckIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Mon', amount: 5000 },
  { name: 'Tue', amount: 8000 },
  { name: 'Wed', amount: 7000 },
  { name: 'Thu', amount: 9000 },
  { name: 'Fri', amount: 8500 },
  { name: 'Sat', amount: 10000 },
  { name: 'Sun', amount: 11000 },
];

const fuelData = [
  { name: 'Essence', value: 4000 },
  { name: 'Diesel', value: 3000 },
  { name: 'Super', value: 2000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue dans votre système de gestion de station-service.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Ventes totales</p>
                <h3 className="text-2xl font-bold">24,500 MAD</h3>
                <div className="flex items-center mt-1 text-sm text-emerald-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12% vs mois dernier</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <TruckIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Stock carburant</p>
                <h3 className="text-2xl font-bold">24,500 L</h3>
                <div className="flex items-center mt-1 text-sm text-rose-500">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <span>8% vs mois dernier</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Employés actifs</p>
                <h3 className="text-2xl font-bold">12</h3>
                <div className="flex items-center mt-1 text-sm text-emerald-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>2 depuis la semaine dernière</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Plannings actifs</p>
                <h3 className="text-2xl font-bold">8</h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <span>Pour la semaine en cours</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="fuel">Carburant</TabsTrigger>
          <TabsTrigger value="employees">Employés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>Ventes mensuelles</CardTitle>
              <CardDescription>Évolution des ventes pour jours en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}D`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorAmount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fuel" className="animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>Ventes par type de carburant</CardTitle>
              <CardDescription>Répartition des ventes par type de carburant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fuelData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}L`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="employees" className="animate-slide-in">
          <Card>
            <CardHeader>
              <CardTitle>Planning des employés</CardTitle>
              <CardDescription>Aperçu de la semaine en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center p-4 border rounded-md bg-accent/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">ZF</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Zakaria Fettah</p>
                    <p className="text-sm text-muted-foreground">Station Centre-ville</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Lun - Ven</p>
                    <p className="text-sm text-muted-foreground">8:00 - 16:00</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-md bg-accent/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">MS</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Marwa Safir</p>
                    <p className="text-sm text-muted-foreground">Station Périphérique</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Mar - Sam</p>
                    <p className="text-sm text-muted-foreground">12:00 - 20:00</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-md bg-accent/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">AB</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Ahmed Berrada</p>
                    <p className="text-sm text-muted-foreground">Station Autoroute</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Lun - Jeu</p>
                    <p className="text-sm text-muted-foreground">6:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Citernes et niveaux</CardTitle>
            <CardDescription>État des stocks de carburants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Essence (30,000L)</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Diesel (50,000L)</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Super (20,000L)</span>
                  <span className="text-sm text-muted-foreground">15%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prochaines livraisons</CardTitle>
            <CardDescription>Livraisons prévues pour les 7 prochains jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center p-4 border rounded-md bg-accent/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <TruckIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Total Energies</p>
                  <p className="text-sm text-muted-foreground">Diesel - 15,000L</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-emerald-500">Demain</p>
                  <p className="text-sm text-muted-foreground">10:00</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border rounded-md bg-accent/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <TruckIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Shell</p>
                  <p className="text-sm text-muted-foreground">Essence - 10,000L</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Jeudi</p>
                  <p className="text-sm text-muted-foreground">14:30</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 border rounded-md bg-accent/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <TruckIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">BP</p>
                  <p className="text-sm text-muted-foreground">Super - 8,000L</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Vendredi</p>
                  <p className="text-sm text-muted-foreground">09:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
