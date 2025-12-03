import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Sparkles, 
  Star, 
  Sun, 
  Moon, 
  Heart, 
  Compass, 
  Brain, 
  Zap, 
  Shield,
  Target,
  Users,
  Briefcase,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Check,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEO } from "@/components/SEO";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Form validation schema
const birthDataSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required for accurate reading"),
  birthLocation: z.string().min(1, "Birth location is required"),
});

type BirthDataForm = z.infer<typeof birthDataSchema>;

// Human Design reading type
interface HumanDesignReading {
  type: string;
  strategy: string;
  authority: string;
  profile: string;
  profileDescription: string;
  definition: string;
  centers: {
    head: { defined: boolean; theme: string };
    ajna: { defined: boolean; theme: string };
    throat: { defined: boolean; theme: string };
    g: { defined: boolean; theme: string };
    heart: { defined: boolean; theme: string };
    sacral: { defined: boolean; theme: string };
    solarPlexus: { defined: boolean; theme: string };
    spleen: { defined: boolean; theme: string };
    root: { defined: boolean; theme: string };
  };
  definedGates: number[];
  channels: string[];
  incarnationCross: string;
  incarnationCrossDescription: string;
  typeDescription: string;
  strategyDescription: string;
  authorityDescription: string;
  lifeTheme: string;
  notSelfTheme: string;
  signature: string;
  strengths: string[];
  challenges: string[];
  careerGuidance: string;
  relationshipInsights: string;
  birthData: {
    date: string;
    time: string;
    location: string;
    timezone: string;
  };
}

// Type colors
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Generator': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'Manifesting Generator': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'Projector': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'Manifestor': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
  'Reflector': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
};

// Center component for the bodygraph
function CenterNode({ 
  name, 
  defined, 
  position, 
  onClick 
}: { 
  name: string; 
  defined: boolean; 
  position: { top: string; left: string }; 
  onClick: () => void;
}) {
  const centerNames: Record<string, string> = {
    head: 'Head',
    ajna: 'Ajna',
    throat: 'Throat',
    g: 'G Center',
    heart: 'Heart',
    sacral: 'Sacral',
    solarPlexus: 'Solar Plexus',
    spleen: 'Spleen',
    root: 'Root',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
        defined 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-300' 
          : 'bg-white border-2 border-gray-300 text-gray-600'
      }`}
      style={{ top: position.top, left: position.left }}
      data-testid={`center-${name}`}
    >
      {centerNames[name]?.charAt(0) || name.charAt(0).toUpperCase()}
    </motion.button>
  );
}

// Comprehensive world cities list for Human Design readings
const CITIES = [
  // United States
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Houston, USA", "Phoenix, USA",
  "Philadelphia, USA", "San Antonio, USA", "San Diego, USA", "Dallas, USA", "San Jose, USA",
  "Austin, USA", "Jacksonville, USA", "Seattle, USA", "Denver, USA", "Boston, USA",
  "Miami, USA", "Atlanta, USA", "Nashville, USA", "Detroit, USA", "Minneapolis, USA",
  "Portland, USA", "Las Vegas, USA", "Orlando, USA", "Charlotte, USA", "San Francisco, USA",
  "Baltimore, USA", "Memphis, USA", "New Orleans, USA", "Cleveland, USA", "Albuquerque, USA",
  "Tucson, USA", "Fresno, USA", "Sacramento, USA", "Long Beach, USA", "Kansas City, USA",
  "Corpus Christi, USA", "Cincinnati, USA", "Stockton, USA", "Arlington, USA", "Riverside, USA",
  "Irvine, USA", "Toledo, USA", "Anaheim, USA", "Bakersfield, USA", "St. Louis, USA",
  "Chandler, USA", "Laredo, USA", "Chula Vista, USA", "Santa Ana, USA", "Reno, USA",
  "Louisville, USA", "Madison, USA", "Irving, USA", "Plano, USA", "Durham, USA",
  "Lexington, USA", "Garland, USA", "Lubbock, USA", "Winston-Salem, USA", "Greensboro, USA",
  "Anchorage, USA", "Honolulu, USA", "Boise, USA", "Buffalo, USA", "Pittsburgh, USA",
  // Canada
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada", "Calgary, Canada",
  "Edmonton, Canada", "Ottawa, Canada", "Winnipeg, Canada", "Quebec City, Canada",
  "Hamilton, Canada", "Kitchener, Canada", "London, Canada", "Halifax, Canada",
  "Victoria, Canada", "Saskatoon, Canada", "Montreal, Canada", "Surrey, Canada",
  // Mexico
  "Mexico City, Mexico", "Guadalajara, Mexico", "Monterry, Mexico", "Cancun, Mexico",
  "Playa del Carmen, Mexico", "Merida, Mexico", "Puebla, Mexico", "Queretaro, Mexico",
  "Veracruz, Mexico", "Tijuana, Mexico", "Acapulco, Mexico", "Mazatlan, Mexico",
  // UK
  "London, UK", "Manchester, UK", "Birmingham, UK", "Leeds, UK", "Glasgow, UK",
  "Liverpool, UK", "Newcastle, UK", "Bristol, UK", "Edinburgh, UK", "Leicester, UK",
  "Nottingham, UK", "Oxford, UK", "Cambridge, UK", "York, UK", "Brighton, UK",
  "Southampton, UK", "Coventry, UK", "Reading, UK", "Derby, UK", "Hull, UK",
  // France
  "Paris, France", "Marseille, France", "Lyon, France", "Toulouse, France",
  "Nice, France", "Nantes, France", "Strasbourg, France", "Montpellier, France",
  "Bordeaux, France", "Lille, France", "Rennes, France", "Reims, France",
  "Le Havre, France", "Saint-Etienne, France", "Toulon, France", "Grenoble, France",
  "Angers, France", "Dijon, France", "Brest, France", "Nimes, France",
  // Germany
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Cologne, Germany",
  "Frankfurt, Germany", "Stuttgart, Germany", "Düsseldorf, Germany", "Dortmund, Germany",
  "Essen, Germany", "Leipzig, Germany", "Dresden, Germany", "Hannover, Germany",
  "Nuremberg, Germany", "Duisburg, Germany", "Bochum, Germany", "Wuppertal, Germany",
  "Bielefeld, Germany", "Bonn, Germany", "Mannheim, Germany", "Karlsruhe, Germany",
  // Spain
  "Madrid, Spain", "Barcelona, Spain", "Seville, Spain", "Valencia, Spain",
  "Bilbao, Spain", "Malaga, Spain", "Murcia, Spain", "Palma, Spain", "Las Palmas, Spain",
  "Alicante, Spain", "Cordoba, Spain", "Valladolid, Spain", "Vigo, Spain", "Gijon, Spain",
  "Oviedo, Spain", "Almeria, Spain", "San Sebastian, Spain", "Zaragoza, Spain",
  // Italy
  "Rome, Italy", "Milan, Italy", "Naples, Italy", "Turin, Italy", "Palermo, Italy",
  "Genoa, Italy", "Bologna, Italy", "Florence, Italy", "Bari, Italy", "Catania, Italy",
  "Venice, Italy", "Verona, Italy", "Messina, Italy", "Padua, Italy", "Trieste, Italy",
  "Parma, Italy", "Perugia, Italy", "Reggio Calabria, Italy", "Livorno, Italy", "Ancona, Italy",
  // Netherlands
  "Amsterdam, Netherlands", "Rotterdam, Netherlands", "The Hague, Netherlands",
  "Utrecht, Netherlands", "Eindhoven, Netherlands", "Groningen, Netherlands",
  "Tilburg, Netherlands", "Almere, Netherlands", "Breda, Netherlands", "Nijmegen, Netherlands",
  // Belgium
  "Brussels, Belgium", "Antwerp, Belgium", "Ghent, Belgium", "Charleroi, Belgium",
  "Liege, Belgium", "Bruges, Belgium", "Namur, Belgium", "Mons, Belgium",
  // Austria
  "Vienna, Austria", "Graz, Austria", "Linz, Austria", "Salzburg, Austria",
  "Innsbruck, Austria", "Klagenfurt, Austria", "Villach, Austria", "Wels, Austria",
  // Switzerland
  "Zurich, Switzerland", "Geneva, Switzerland", "Basel, Switzerland", "Bern, Switzerland",
  "Lausanne, Switzerland", "Lucerne, Switzerland", "St. Gallen, Switzerland", "Winterthur, Switzerland",
  "Neuchatel, Switzerland", "Fribourg, Switzerland",
  // Sweden
  "Stockholm, Sweden", "Gothenburg, Sweden", "Malmo, Sweden", "Uppsala, Sweden",
  "Vasteras, Sweden", "Orebro, Sweden", "Linkoping, Sweden", "Helsingborg, Sweden",
  // Norway
  "Oslo, Norway", "Bergen, Norway", "Trondheim, Norway", "Stavanger, Norway",
  "Drammen, Norway", "Fredrikstad, Norway", "Kristiansand, Norway", "Sandnes, Norway",
  // Denmark
  "Copenhagen, Denmark", "Aarhus, Denmark", "Odense, Denmark", "Aalborg, Denmark",
  "Esbjerg, Denmark", "Randers, Denmark", "Viborg, Denmark",
  // Finland
  "Helsinki, Finland", "Espoo, Finland", "Tampere, Finland", "Vantaa, Finland",
  "Turku, Finland", "Oulu, Finland", "Jyvaskyla, Finland", "Kuopio, Finland",
  // Poland
  "Warsaw, Poland", "Krakow, Poland", "Gdansk, Poland", "Wroclaw, Poland",
  "Poznan, Poland", "Gdynia, Poland", "Szczecin, Poland", "Bydgoszcz, Poland",
  "Lublin, Poland", "Katowice, Poland",
  // Czech Republic
  "Prague, Czech Republic", "Brno, Czech Republic", "Ostrava, Czech Republic", "Plzen, Czech Republic",
  "Liberec, Czech Republic", "Olomouc, Czech Republic", "Ceske Budejovice, Czech Republic",
  // Hungary
  "Budapest, Hungary", "Debrecen, Hungary", "Szeged, Hungary", "Miskolc, Hungary",
  "Pecs, Hungary", "Gyor, Hungary", "Nyiregyhaza, Hungary", "Kecskement, Hungary",
  // Romania
  "Bucharest, Romania", "Cluj-Napoca, Romania", "Timisoara, Romania", "Iasi, Romania",
  "Constanta, Romania", "Craiova, Romania", "Brasov, Romania", "Galati, Romania",
  // Greece
  "Athens, Greece", "Thessaloniki, Greece", "Patras, Greece", "Heraklion, Greece",
  "Larissa, Greece", "Ioannina, Greece", "Volos, Greece", "Rethymno, Greece",
  // Portugal
  "Lisbon, Portugal", "Porto, Portugal", "Covilha, Portugal", "Braga, Portugal",
  "Amadora, Portugal", "Funchal, Portugal", "Viseu, Portugal", "Aveiro, Portugal",
  // Ireland
  "Dublin, Ireland", "Cork, Ireland", "Galway, Ireland", "Limerick, Ireland",
  "Waterford, Ireland", "Drogheda, Ireland", "Tralee, Ireland", "Sligo, Ireland",
  // Turkey
  "Istanbul, Turkey", "Ankara, Turkey", "Izmir, Turkey", "Bursa, Turkey",
  "Antalya, Turkey", "Konya, Turkey", "Adana, Turkey", "Gaziantep, Turkey",
  "Mersin, Turkey", "Kayseri, Turkey", "Samsun, Turkey", "Diyarbakir, Turkey",
  // Israel
  "Tel Aviv, Israel", "Jerusalem, Israel", "Haifa, Israel", "Rishon LeZion, Israel",
  "Petah Tikva, Israel", "Ashdod, Israel", "Netanya, Israel", "Beersheba, Israel",
  // Egypt
  "Cairo, Egypt", "Alexandria, Egypt", "Giza, Egypt", "Shubra El-Kheima, Egypt",
  "Helwan, Egypt", "Port Said, Egypt", "Suez, Egypt", "Luxor, Egypt", "Aswan, Egypt",
  // South Africa
  "Johannesburg, South Africa", "Cape Town, South Africa", "Durban, South Africa",
  "Pretoria, South Africa", "Port Elizabeth, South Africa", "Bloemfontein, South Africa",
  "Soweto, South Africa", "East London, South Africa", "Pietermaritzburg, South Africa",
  // Nigeria
  "Lagos, Nigeria", "Abuja, Nigeria", "Port Harcourt, Nigeria", "Kano, Nigeria",
  "Ibadan, Nigeria", "Benin City, Nigeria", "Maiduguri, Nigeria", "Owerri, Nigeria",
  // Kenya
  "Nairobi, Kenya", "Mombasa, Kenya", "Kisumu, Kenya", "Nakuru, Kenya",
  "Eldoret, Kenya", "Naivasha, Kenya", "Thika, Kenya",
  // Ethiopia
  "Addis Ababa, Ethiopia", "Dire Dawa, Ethiopia", "Adama, Ethiopia", "Mek'ele, Ethiopia",
  // Ghana
  "Accra, Ghana", "Kumasi, Ghana", "Sekondi-Takoradi, Ghana", "Tamale, Ghana",
  // Russia
  "Moscow, Russia", "Saint Petersburg, Russia", "Novosibirsk, Russia", "Yekaterinburg, Russia",
  "Vladivostok, Russia", "Sochi, Russia", "Krasnoyarsk, Russia", "Perm, Russia",
  "Kazan, Russia", "Samara, Russia", "Ufa, Russia", "Irkutsk, Russia",
  // India
  "Mumbai, India", "Delhi, India", "Bangalore, India", "Hyderabad, India",
  "Chennai, India", "Kolkata, India", "Pune, India", "Ahmedabad, India",
  "Jaipur, India", "Lucknow, India", "Chandigarh, India", "Surat, India",
  "Nagpur, India", "Indore, India", "Thane, India", "Bhopal, India",
  "Visakhapatnam, India", "Vadodara, India", "Ghaziabad, India", "Ludhiana, India",
  "Kochi, India", "Coimbatore, India", "Pondicherry, India", "Mysore, India",
  // Pakistan
  "Karachi, Pakistan", "Lahore, Pakistan", "Faisalabad, Pakistan", "Rawalpindi, Pakistan",
  "Multan, Pakistan", "Hyderabad, Pakistan", "Islamabad, Pakistan", "Peshawar, Pakistan",
  "Quetta, Pakistan", "Sialkot, Pakistan",
  // Bangladesh
  "Dhaka, Bangladesh", "Chittagong, Bangladesh", "Khulna, Bangladesh", "Rajshahi, Bangladesh",
  "Barisal, Bangladesh", "Sylhet, Bangladesh", "Rangpur, Bangladesh",
  // Sri Lanka
  "Colombo, Sri Lanka", "Kandy, Sri Lanka", "Galle, Sri Lanka", "Jaffna, Sri Lanka",
  "Negombo, Sri Lanka", "Nuwara Eliya, Sri Lanka", "Badulla, Sri Lanka",
  // Thailand
  "Bangkok, Thailand", "Chiang Mai, Thailand", "Phuket, Thailand", "Chiang Rai, Thailand",
  "Pattaya, Thailand", "Hat Yai, Thailand", "Udon Thani, Thailand", "Khon Kaen, Thailand",
  "Rayong, Thailand", "Nakhon Ratchasima, Thailand",
  // Vietnam
  "Ho Chi Minh City, Vietnam", "Hanoi, Vietnam", "Da Nang, Vietnam", "Can Tho, Vietnam",
  "Hai Phong, Vietnam", "Da Lat, Vietnam", "Vung Tau, Vietnam", "Nha Trang, Vietnam",
  // Cambodia
  "Phnom Penh, Cambodia", "Siem Reap, Cambodia", "Battambang, Cambodia", "Sihanoukville, Cambodia",
  // Laos
  "Vientiane, Laos", "Luang Prabang, Laos", "Savannakhet, Laos",
  // Myanmar
  "Yangon, Myanmar", "Mandalay, Myanmar", "Naypyidaw, Myanmar", "Bagan, Myanmar",
  // Malaysia
  "Kuala Lumpur, Malaysia", "Penang, Malaysia", "Johor Bahru, Malaysia", "Melaka, Malaysia",
  "Selangor, Malaysia", "Kota Kinabalu, Malaysia", "Kuching, Malaysia", "Ipoh, Malaysia",
  // Singapore
  "Singapore, Singapore",
  // Indonesia
  "Jakarta, Indonesia", "Bali, Indonesia", "Surabaya, Indonesia", "Bandung, Indonesia",
  "Medan, Indonesia", "Semarang, Indonesia", "Makassar, Indonesia", "Palembang, Indonesia",
  "Yogyakarta, Indonesia", "Denpasar, Indonesia", "Bekasi, Indonesia",
  // Philippines
  "Manila, Philippines", "Cebu, Philippines", "Davao, Philippines", "Quezon City, Philippines",
  "Caloocan, Philippines", "Pasig, Philippines", "Makati, Philippines", "Cagayan de Oro, Philippines",
  "Iloilo, Philippines", "Zamboanga, Philippines",
  // Japan
  "Tokyo, Japan", "Osaka, Japan", "Kyoto, Japan", "Yokohama, Japan",
  "Kobe, Japan", "Fukuoka, Japan", "Sapporo, Japan", "Hiroshima, Japan",
  "Nagoya, Japan", "Kawasaki, Japan", "Nagasaki, Japan", "Sendai, Japan",
  "Nara, Japan", "Okayama, Japan", "Shizuoka, Japan", "Kumamoto, Japan",
  "Hamamatsu, Japan", "Chiba, Japan", "Kitakyushu, Japan",
  // South Korea
  "Seoul, South Korea", "Busan, South Korea", "Incheon, South Korea", "Daegu, South Korea",
  "Daejeon, South Korea", "Gwangju, South Korea", "Ulsan, South Korea", "Gyeonggi, South Korea",
  // China
  "Shanghai, China", "Beijing, China", "Guangzhou, China", "Shenzhen, China",
  "Chongqing, China", "Xi'an, China", "Hangzhou, China", "Wuhan, China",
  "Chengdu, China", "Nanjing, China", "Tianjin, China", "Shenyang, China",
  "Harbin, China", "Changchun, China", "Jinan, China", "Qingdao, China",
  "Suzhou, China", "Xiamen, China", "Nanchang, China", "Guiyang, China",
  "Kunming, China", "Lanzhou, China", "Taiyuan, China", "Ningbo, China",
  // Hong Kong
  "Hong Kong, Hong Kong", "Kowloon, Hong Kong", "New Territories, Hong Kong",
  // Taiwan
  "Taipei, Taiwan", "Kaohsiung, Taiwan", "Taichung, Taiwan", "Tainan, Taiwan",
  "Keelung, Taiwan", "Hsinchu, Taiwan", "Taoyuan, Taiwan",
  // UAE
  "Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Ajman, UAE",
  "Ras Al Khaimah, UAE", "Fujairah, UAE", "Umm Al Quwain, UAE",
  // Saudi Arabia
  "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "Mecca, Saudi Arabia", "Medina, Saudi Arabia",
  "Dammam, Saudi Arabia", "Khobar, Saudi Arabia", "Abha, Saudi Arabia",
  // Iraq
  "Baghdad, Iraq", "Basra, Iraq", "Mosul, Iraq", "Erbil, Iraq",
  // Iran
  "Tehran, Iran", "Mashhad, Iran", "Isfahan, Iran", "Shiraz, Iran",
  "Tabriz, Iran", "Qom, Iran", "Karaj, Iran", "Ahvaz, Iran",
  // Qatar
  "Doha, Qatar", "Al Rayyan, Qatar", "Al Wakrah, Qatar",
  // Kuwait
  "Kuwait City, Kuwait", "Al Jahra, Kuwait", "Salmiya, Kuwait",
  // Oman
  "Muscat, Oman", "Salalah, Oman", "Nizwa, Oman",
  // Lebanon
  "Beirut, Lebanon", "Tripoli, Lebanon", "Sidon, Lebanon", "Tyre, Lebanon",
  // Syria
  "Damascus, Syria", "Aleppo, Syria", "Homs, Syria", "Latakia, Syria",
  // Jordan
  "Amman, Jordan", "Zarqa, Jordan", "Irbid, Jordan", "Aqaba, Jordan",
  // Palestine
  "Ramallah, Palestine", "Gaza City, Palestine", "Bethlehem, Palestine",
  // Australia
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
  "Adelaide, Australia", "Gold Coast, Australia", "Newcastle, Australia", "Canberra, Australia",
  "Hobart, Australia", "Darwin, Australia", "Geelong, Australia", "Townsville, Australia",
  // New Zealand
  "Auckland, New Zealand", "Christchurch, New Zealand", "Wellington, New Zealand",
  "Hamiltion, New Zealand", "Tauranga, New Zealand", "Dunedin, New Zealand",
  "Palmerston North, New Zealand", "Rotorua, New Zealand",
  // Fiji
  "Suva, Fiji", "Nadi, Fiji", "Lautoka, Fiji",
  // Argentina
  "Buenos Aires, Argentina", "Córdoba, Argentina", "Rosario, Argentina", "Mendoza, Argentina",
  "San Miguel de Tucuman, Argentina", "La Plata, Argentina", "Mar del Plata, Argentina",
  "Salta, Argentina", "Santa Fe, Argentina", "Quilmes, Argentina",
  // Brazil
  "São Paulo, Brazil", "Rio de Janeiro, Brazil", "Brasília, Brazil", "Salvador, Brazil",
  "Fortaleza, Brazil", "Belo Horizonte, Brazil", "Manaus, Brazil", "Curitiba, Brazil",
  "Recife, Brazil", "Porto Alegre, Brazil", "Goiânia, Brazil", "Belém, Brazil",
  "Guarulhos, Brazil", "Campinas, Brazil", "Santos, Brazil", "Osasco, Brazil",
  "Sorocaba, Brazil", "Ribeirão Preto, Brazil", "Uberlândia, Brazil",
  // Chile
  "Santiago, Chile", "Valparaiso, Chile", "Concepcion, Chile", "La Serena, Chile",
  "Temuco, Chile", "Valdivia, Chile", "Puerto Montt, Chile", "Antofagasta, Chile",
  "Puerta Varas, Chile", "Punta Arenas, Chile",
  // Peru
  "Lima, Peru", "Arequipa, Peru", "Trujillo, Peru", "Chiclayo, Peru",
  "Iquitos, Peru", "Cusco, Peru", "Tacna, Peru", "Puno, Peru",
  // Colombia
  "Bogota, Colombia", "Medellin, Colombia", "Cali, Colombia", "Barranquilla, Colombia",
  "Cartagena, Colombia", "Bucaramanga, Colombia", "Santa Marta, Colombia", "Armenia, Colombia",
  // Venezuela
  "Caracas, Venezuela", "Maracaibo, Venezuela", "Valencia, Venezuela", "Barquisimeto, Venezuela",
  "Maracay, Venezuela", "Ciudad Guayana, Venezuela",
  // Ecuador
  "Quito, Ecuador", "Guayaquil, Ecuador", "Cuenca, Ecuador", "Santo Domingo, Ecuador",
  // Bolivia
  "La Paz, Bolivia", "Santa Cruz, Bolivia", "Cochabamba, Bolivia", "Sucre, Bolivia",
  // Paraguay
  "Asuncion, Paraguay", "Ciudad del Este, Paraguay", "Encarnacion, Paraguay",
  // Uruguay
  "Montevideo, Uruguay", "Salto, Uruguay", "Paysandu, Uruguay", "Las Piedras, Uruguay",
  // Costa Rica
  "San Jose, Costa Rica", "Alajuela, Costa Rica", "Cartago, Costa Rica", "Heredia, Costa Rica",
  // Panama
  "Panama City, Panama", "Colon, Panama", "David, Panama",
  // Guatemala
  "Guatemala City, Guatemala", "Quetzaltenango, Guatemala", "Antigua, Guatemala",
  // Honduras
  "Tegucigalpa, Honduras", "San Pedro Sula, Honduras", "La Ceiba, Honduras",
  // Nicaragua
  "Managua, Nicaragua", "Leon, Nicaragua", "Granada, Nicaragua",
  // El Salvador
  "San Salvador, El Salvador", "Santa Ana, El Salvador", "San Miguel, El Salvador",
  // Belize
  "Belize City, Belize", "San Ignacio, Belize",
  // Dominican Republic
  "Santo Domingo, Dominican Republic", "Santiago, Dominican Republic", "La Romana, Dominican Republic",
  // Haiti
  "Port-au-Prince, Haiti", "Cap-Haitien, Haiti", "Gonaives, Haiti",
  // Jamaica
  "Kingston, Jamaica", "Montego Bay, Jamaica", "Spanish Town, Jamaica",
  // Cuba
  "Havana, Cuba", "Santiago de Cuba, Cuba", "Camaguey, Cuba", "Holguin, Cuba",
  // Puerto Rico
  "San Juan, Puerto Rico", "Bayamon, Puerto Rico", "Carolina, Puerto Rico",
  // Colombia
  "Bogota, Colombia", "Medellin, Colombia", "Cali, Colombia", "Barranquilla, Colombia",
].sort();

export default function HumanDesignPage() {
  const [reading, setReading] = useState<HumanDesignReading | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('type');
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<BirthDataForm>({
    resolver: zodResolver(birthDataSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "",
      birthLocation: "",
    },
  });

  const generateReading = useMutation({
    mutationFn: async (data: BirthDataForm) => {
      const response = await apiRequest("POST", "/api/human-design/calculate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setReading(data);
    },
  });

  const onSubmit = (data: BirthDataForm) => {
    generateReading.mutate(data);
  };

  // Center positions for bodygraph visualization
  const centerPositions: Record<string, { top: string; left: string }> = {
    head: { top: '5%', left: '50%' },
    ajna: { top: '18%', left: '50%' },
    throat: { top: '32%', left: '50%' },
    g: { top: '48%', left: '50%' },
    heart: { top: '45%', left: '30%' },
    spleen: { top: '60%', left: '25%' },
    sacral: { top: '65%', left: '50%' },
    solarPlexus: { top: '60%', left: '75%' },
    root: { top: '82%', left: '50%' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      <SEO
        title="Unlock Your Human Design - MetaHers Mind Spa"
        description="Discover your unique Human Design blueprint based on your exact birth data. Get personalized insights into your type, strategy, authority, and life purpose."
        keywords="human design, birth chart, energy type, strategy, authority, life purpose, self-discovery"
        url="https://metahers.ai/human-design"
      />

      {/* Hero Section */}
      <section className="relative py-20 px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 left-10 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-20"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Your Blueprint
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6">
              Unlock Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Human Design
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Your unique energetic blueprint reveals how you're designed to make decisions, 
              interact with others, and fulfill your life purpose. Enter your birth data for 
              an accurate, personalized reading.
            </p>
          </motion.div>

          {/* Birth Data Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-xl mx-auto p-8 border-2 border-purple-200 shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Birth Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="border-purple-200 focus:border-purple-500"
                            data-testid="input-birth-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-purple-600" />
                          Birth Time (as accurate as possible)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            className="border-purple-200 focus:border-purple-500"
                            data-testid="input-birth-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          Birth Location
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="border-purple-200 focus:border-purple-500" data-testid="select-birth-location">
                              <SelectValue placeholder="Select your birth city..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {CITIES.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={generateReading.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-4 text-lg"
                    data-testid="button-generate-reading"
                  >
                    {generateReading.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Generate My Reading
                        <Sparkles className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Reading Results */}
      <AnimatePresence>
        {reading && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="py-16 px-6 lg:px-16"
          >
            <div className="max-w-6xl mx-auto">
              {/* Preview Section - Visible to Everyone */}
              <div className="text-center mb-12 p-8 bg-gradient-to-b from-purple-50 to-white rounded-2xl border-2 border-purple-200">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Badge 
                    className={`text-lg px-6 py-3 mb-4 ${TYPE_COLORS[reading.type]?.bg} ${TYPE_COLORS[reading.type]?.text} ${TYPE_COLORS[reading.type]?.border} border-2`}
                  >
                    You are a {reading.type}
                  </Badge>
                </motion.div>
                <h2 className="text-4xl font-bold text-black mb-4">
                  {reading.profile}
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-6">
                  {reading.typeDescription}
                </p>
                
                {/* Preview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Strategy', value: reading.strategy, icon: Compass },
                    { label: 'Authority', value: reading.authority, icon: Brain },
                    { label: 'Signature', value: reading.signature, icon: Heart },
                    { label: 'Not-Self', value: reading.notSelfTheme, icon: Shield },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-4 text-center border-2 border-purple-100">
                        <stat.icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{stat.label}</p>
                        <p className="font-bold text-gray-900">{stat.value}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Full Reading - Gated Behind Authentication */}
              {isAuthenticated ? (
                <>
                  {/* Two Column Layout */}
                  <div className="grid lg:grid-cols-2 gap-8">
                {/* Left: Bodygraph Visualization */}
                <Card className="p-8 border-2 border-purple-200">
                  <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                    <Sun className="w-6 h-6 text-purple-600" />
                    Your Bodygraph
                  </h3>
                  
                  <div className="relative h-96 bg-gradient-to-b from-purple-50 to-white rounded-xl">
                    {Object.entries(reading.centers).map(([name, center]) => (
                      <CenterNode
                        key={name}
                        name={name}
                        defined={center.defined}
                        position={centerPositions[name]}
                        onClick={() => setSelectedCenter(selectedCenter === name ? null : name)}
                      />
                    ))}
                    
                    {/* Connection lines would go here - simplified for now */}
                  </div>

                  {/* Selected Center Info */}
                  <AnimatePresence>
                    {selectedCenter && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-purple-50 rounded-lg"
                      >
                        <h4 className="font-bold text-purple-700 mb-2 capitalize">
                          {selectedCenter === 'g' ? 'G Center' : selectedCenter === 'solarPlexus' ? 'Solar Plexus' : selectedCenter} Center
                          <Badge className={`ml-2 ${reading.centers[selectedCenter as keyof typeof reading.centers].defined ? 'bg-purple-600' : 'bg-gray-400'}`}>
                            {reading.centers[selectedCenter as keyof typeof reading.centers].defined ? 'Defined' : 'Undefined'}
                          </Badge>
                        </h4>
                        <p className="text-sm text-gray-700">
                          {reading.centers[selectedCenter as keyof typeof reading.centers].theme}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Right: Detailed Reading */}
                <div className="space-y-4">
                  {/* Expandable Sections */}
                  {[
                    { id: 'type', title: 'Your Type & Strategy', icon: Target, content: reading.strategyDescription },
                    { id: 'authority', title: 'Your Authority', icon: Brain, content: reading.authorityDescription },
                    { id: 'profile', title: 'Your Profile', icon: Users, content: reading.profileDescription },
                    { id: 'cross', title: 'Incarnation Cross', icon: Compass, content: reading.incarnationCrossDescription },
                    { id: 'career', title: 'Career Guidance', icon: Briefcase, content: reading.careerGuidance },
                    { id: 'relationships', title: 'Relationship Insights', icon: Heart, content: reading.relationshipInsights },
                  ].map((section) => (
                    <motion.div key={section.id} layout>
                      <Card 
                        className={`border-2 transition-colors cursor-pointer ${
                          expandedSection === section.id ? 'border-purple-400' : 'border-purple-100 hover:border-purple-200'
                        }`}
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <section.icon className="w-5 h-5 text-purple-600" />
                            <h4 className="font-bold text-gray-900">{section.title}</h4>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSection === section.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedSection === section.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-gray-700">
                                {section.content}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Strengths & Challenges */}
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card className="p-6 border-2 border-green-200 bg-green-50">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {reading.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 border-2 border-amber-200 bg-amber-50">
                  <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Growth Edges
                  </h3>
                  <ul className="space-y-2">
                    {reading.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <ArrowRight className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Defined Gates & Channels */}
              <Card className="mt-12 p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-600" />
                  Your Defined Gates & Channels
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">Active Gates</h4>
                    <div className="flex flex-wrap gap-2">
                      {reading.definedGates.map((gate) => (
                        <Badge key={gate} className="bg-purple-100 text-purple-700 border border-purple-300">
                          Gate {gate}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3">Defined Channels</h4>
                    {reading.channels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {reading.channels.map((channel) => (
                          <Badge key={channel} className="bg-pink-100 text-pink-700 border border-pink-300">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No complete channels defined</p>
                    )}
                  </div>
                </div>
              </Card>

                  {/* CTA for Authenticated Users */}
                  <div className="mt-12 text-center">
                    <Card className="inline-block p-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
                      <h3 className="text-2xl font-bold text-black mb-4">
                        Want to Go Deeper?
                      </h3>
                      <p className="text-gray-700 mb-6 max-w-lg">
                        Explore how your Human Design connects with AI tools, business strategy, and personal transformation in your full Member Dashboard.
                      </p>
                      <Button
                        onClick={() => setLocation('/dashboard')}
                        className="bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-wider px-8"
                        data-testid="button-explore-dashboard"
                      >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Card>
                  </div>
                </>
              ) : (
                // Sign-in Gate for Unauthenticated Users
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mt-12 p-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-3 border-purple-300 text-center"
                >
                  <Lock className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-black mb-4">
                    Unlock Your Full Human Design Reading
                  </h3>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
                    You've seen your type and strategy. Sign in to access your complete personalized reading including:
                  </p>
                  <ul className="text-left max-w-md mx-auto mb-8 space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Your detailed bodygraph visualization</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Authority & decision-making guidance</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Career and relationship insights</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">All 9 centers & defined gates analysis</span>
                    </li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setLocation('/login')}
                      className="bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-wider px-8 py-3 text-lg"
                      data-testid="button-sign-in-reading"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => setLocation('/signup')}
                      variant="outline"
                      className="border-2 border-black text-black hover:bg-black hover:text-white font-bold uppercase tracking-wider px-8 py-3 text-lg"
                      data-testid="button-create-account-reading"
                    >
                      Create Account
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Info Section (shown when no reading yet) */}
      {!reading && (
        <section className="py-16 px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-black mb-12">
              What is Human Design?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sun,
                  title: "Your Energetic Blueprint",
                  description: "Human Design combines astrology, I Ching, Kabbalah, and the chakra system to reveal your unique energetic makeup."
                },
                {
                  icon: Compass,
                  title: "Decision-Making Clarity",
                  description: "Discover your personal authority - the reliable way your body communicates correct decisions for you."
                },
                {
                  icon: Users,
                  title: "Relationship Dynamics",
                  description: "Understand how you interact with others, where you're open to influence, and where you have consistent energy."
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 text-center border-2 border-purple-100 hover:border-purple-300 transition-colors h-full">
                    <item.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 5 Types */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center text-black mb-8">The 5 Human Design Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { type: 'Generator', percent: '37%', color: 'orange' },
                  { type: 'Manifesting Generator', percent: '33%', color: 'amber' },
                  { type: 'Projector', percent: '20%', color: 'blue' },
                  { type: 'Manifestor', percent: '9%', color: 'red' },
                  { type: 'Reflector', percent: '1%', color: 'purple' },
                ].map((item) => (
                  <Card 
                    key={item.type} 
                    className={`p-4 text-center border-2 ${TYPE_COLORS[item.type]?.border} ${TYPE_COLORS[item.type]?.bg}`}
                  >
                    <p className={`font-bold ${TYPE_COLORS[item.type]?.text}`}>{item.type}</p>
                    <p className="text-sm text-gray-600">{item.percent} of population</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
