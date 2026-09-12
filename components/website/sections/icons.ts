/**
 * Curated lucide icon set for website sections, resolved by name (icon names are stored as
 * strings in section content). Keeps the rendered site's icon vocabulary consistent and modern.
 */
import {
  GraduationCap, FlaskConical, Palette, Trophy, Globe2, HeartHandshake, BookOpen, Users,
  Award, Star, MapPin, Phone, Mail, Calendar, Sparkles, Quote, CheckCircle2, ArrowRight,
  Play, Building2, Library, Microscope, Music, Dumbbell, Languages, ShieldCheck, Lightbulb,
  Target, Rocket, Compass, PenTool, LayoutGrid, BarChart3, Images, Megaphone, Square,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap, FlaskConical, Palette, Trophy, Globe2, HeartHandshake, BookOpen, Users,
  Award, Star, MapPin, Phone, Mail, Calendar, Sparkles, Quote, CheckCircle2, ArrowRight,
  Play, Building2, Library, Microscope, Music, Dumbbell, Languages, ShieldCheck, Lightbulb,
  Target, Rocket, Compass, PenTool, LayoutGrid, BarChart3, Images, Megaphone, Square,
};

export function resolveIcon(name?: string): LucideIcon {
  return (name && ICON_MAP[name]) || Sparkles;
}

/** Icon names offered in pickers, in a sensible order. */
export const ICON_CHOICES = Object.keys(ICON_MAP);
