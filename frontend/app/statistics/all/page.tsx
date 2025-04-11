"use client";

import { useEffect, useState } from "react";
import { getAllCommandes } from "@/utils/apiCommandes";
import { Commande } from "@/types/Commandes";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Euro,
  User,
  Store,
} from "lucide-react";
import { useMe } from "@/hooks/useMe";
import BaseHeader from "@/components/header_footers/BaseHeader";
import { ServiceCommercialNavigationBar } from "@/components/header_footers/ServiceCommercialNavigationBar";

export default function StatisticsPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [totalEnCours, setTotalEnCours] = useState<number>(0);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { user } = useMe(accessToken ?? "");
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "SERVICE_COMMERCIAL") {
      console.log("User is not a SERVICE_COMMERCIAL");
      router.push("/");
      return;
    }

    const fetchCommandes = async () => {
      try {
        if (!accessToken) return;
        const data = await getAllCommandes(accessToken);
        // Tri des commandes par date (les plus récentes en premier)
        const sortedData = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setCommandes(sortedData);

        // Calcul du total des commandes en cours
        const total = data
          .filter(
            (commande) =>
              commande.status === "PENDING" ||
              commande.status === "CONFIRMED" ||
              commande.status === "IN_PROGRESS"
          )
          .reduce((sum, commande) => sum + commande.prixTotal, 0);
        setTotalEnCours(total);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    };

    fetchCommandes();
  }, [user, accessToken, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONFIRMED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <Package className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "En attente";
      case "CONFIRMED":
        return "Confirmée";
      case "IN_PROGRESS":
        return "En cours";
      case "DELIVERED":
        return "Livrée";
      case "CANCELLED":
        return "Annulée";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BaseHeader />
      <div className="container mx-auto p-4 space-y-6 pt-20 pb-24">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              Total des commandes en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary flex items-center gap-2">
              <Euro className="w-6 h-6" />
              {totalEnCours.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900">
                  ID
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Client
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Restaurant
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Statut
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    Total
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandes.map((commande) => (
                <TableRow key={commande.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{commande.id}</TableCell>
                  <TableCell>
                    {commande.createdAt
                      ? format(new Date(commande.createdAt), "PPP", {
                          locale: fr,
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>{commande.client.lastName}</TableCell>
                  <TableCell>{commande.restaurant.name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                        commande.status
                      )}`}
                    >
                      {getStatusIcon(commande.status)}
                      {getStatusText(commande.status)}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {commande.prixTotal.toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ServiceCommercialNavigationBar selectedPage="commandes" />
    </div>
  );
}
