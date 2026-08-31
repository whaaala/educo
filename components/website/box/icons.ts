/** Curated icon set for the Icon element (name → lucide component). Names are STORED on the node, so keep
 *  them stable. Shared by BoxCanvas (rendering) and BoxInspector (the icon picker). */
import { Star, Heart, Check, ArrowRight, Zap, Shield, Award, Users, Mail, Phone, MapPin, Calendar, Clock, Globe, Camera, Play, Search, Home, Settings, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICON_SET: Record<string, LucideIcon> = {
  Star, Heart, Check, ArrowRight, Zap, Shield, Award, Users, Mail, Phone, MapPin, Calendar, Clock, Globe, Camera, Play, Search, Home, Settings, Sparkles,
};

export const ICON_NAMES = Object.keys(ICON_SET);
