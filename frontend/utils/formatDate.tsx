/**
 * Formate une date ISO en format lisible
 * @param dateString - Date au format ISO string
 * @returns Date formatée en français
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Date non disponible";
  
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    
    // Options de formatage
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    // Formater la date en français
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "Format de date invalide";
  }
}; 