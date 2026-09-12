/** Icon set for the Icon element (name → lucide component). Names are STORED on the node, so keep them
 *  stable. A broad, categorised library so users can find a fitting symbol. Shared by BoxCanvas (render)
 *  and BoxInspector (the searchable picker). Only stable, generic lucide icons (brand logos come later as
 *  a dedicated Social block). */
import {
  Star, Heart, Check, X, Plus, Minus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ExternalLink,
  Zap, Shield, ShieldCheck, Award, Trophy, Crown, Gem, Sparkles, Flame, Rocket, Target, TrendingUp, ThumbsUp, Gift, Tag, Percent, BadgeCheck,
  Users, User, UserPlus, Mail, MessageCircle, MessageSquare, Send, Phone, PhoneCall, Bell, Megaphone, Handshake, Smile,
  MapPin, Map, Globe, Home, Building2, Store, ShoppingCart, ShoppingBag, CreditCard, Wallet, DollarSign, Package, Truck, Plane,
  Calendar, Clock, Timer, BarChart3, PieChart, LineChart, Activity, Gauge, Database, Layers, Grid3x3,
  Camera, Image, Video, Play, Music, Mic, Film, Headphones, FileText, File, Folder, Download, Upload, Paperclip, Link2, Bookmark,
  Settings, Wrench, Cpu, Code2, Terminal, Cloud, Wifi, Lock, Unlock, Key, Search, Filter, Eye, RefreshCw, Power, Bug,
  Sun, Moon, CloudRain, Droplet, Leaf, TreePine, Coffee, Book, BookOpen, GraduationCap, Lightbulb, Palette, Brush, Feather, Anchor, Compass, Flag,
  type LucideIcon,
} from "lucide-react";

export const ICON_SET: Record<string, LucideIcon> = {
  Star, Heart, Check, X, Plus, Minus, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ExternalLink,
  Zap, Shield, ShieldCheck, Award, Trophy, Crown, Gem, Sparkles, Flame, Rocket, Target, TrendingUp, ThumbsUp, Gift, Tag, Percent, BadgeCheck,
  Users, User, UserPlus, Mail, MessageCircle, MessageSquare, Send, Phone, PhoneCall, Bell, Megaphone, Handshake, Smile,
  MapPin, Map, Globe, Home, Building2, Store, ShoppingCart, ShoppingBag, CreditCard, Wallet, DollarSign, Package, Truck, Plane,
  Calendar, Clock, Timer, BarChart3, PieChart, LineChart, Activity, Gauge, Database, Layers, Grid3x3,
  Camera, Image, Video, Play, Music, Mic, Film, Headphones, FileText, File, Folder, Download, Upload, Paperclip, Link2, Bookmark,
  Settings, Wrench, Cpu, Code2, Terminal, Cloud, Wifi, Lock, Unlock, Key, Search, Filter, Eye, RefreshCw, Power, Bug,
  Sun, Moon, CloudRain, Droplet, Leaf, TreePine, Coffee, Book, BookOpen, GraduationCap, Lightbulb, Palette, Brush, Feather, Anchor, Compass, Flag,
};

export const ICON_NAMES = Object.keys(ICON_SET);
