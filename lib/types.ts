export type AppRole = 'admin' | 'secretary' | 'coach' | 'guardian_portal';
export type EntityStatus = 'active' | 'inactive' | 'archived';
export type EnrollmentStatus = 'pending' | 'active' | 'suspended' | 'cancelled' | 'completed';
export type ChargeStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'bank_slip' | 'transfer';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type DiscountType = 'percentage' | 'fixed_amount' | 'scholarship_full';
export type BillingFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual';

// Posições no Esporte
export type SoccerPosition = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-Campo' | 'Atacante' | 'Fixo' | 'Ala' | 'Pivô';
export type DominantFoot = 'Destro' | 'Canhoto' | 'Ambidestro';

// Dimensões de Gamificação Esportiva
export type SportSkillDimension = 
  | 'passe_dominio' 
  | 'finalizacao_chute' 
  | 'drible_conducao' 
  | 'marcacao_desarme' 
  | 'disciplina_fairplay' 
  | 'trabalho_equipe';

export interface SportSkillPoint {
  id: string;
  student_id: string;
  dimension: SportSkillDimension;
  dimension_label: string;
  points: number;
  notes?: string;
  awarded_by: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  document_number?: string;
  timezone: string;
  status: EntityStatus;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: AppRole;
}

export interface Modality {
  id: string;
  name: string;
  description?: string;
  status: EntityStatus;
}

export interface Plan {
  id: string;
  name: string;
  billing_frequency: BillingFrequency;
  base_amount: number;
  status: EntityStatus;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  weekday: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  location?: string;
}

export interface SportClass {
  id: string;
  modality_id: string;
  modality_name?: string;
  coach_profile_id?: string;
  coach_name?: string;
  name: string;
  age_group: string;
  capacity: number;
  enrolled_count?: number;
  status: EntityStatus;
  schedules?: ClassSchedule[];
}

export interface Guardian {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  document_number?: string;
  address_street?: string;
  address_city?: string;
}

export interface Student {
  id: string;
  full_name: string;
  birth_date: string;
  gender?: string;
  position?: SoccerPosition;
  dominant_foot?: DominantFoot;
  jersey_size?: string; // Tam 8, 10, 12, P, M
  medical_alerts?: string;
  status: EntityStatus;
  guardian?: Guardian;
  relationship?: string;
  current_class?: {
    id: string;
    name: string;
    modality_name: string;
  };
  current_plan?: {
    id: string;
    name: string;
    agreed_amount: number;
  };
  financial_status?: 'ok' | 'overdue' | 'pending';
  // Gamificação Esportiva
  total_points?: number;
  stars_count?: number;
  player_level?: 'Iniciante' | 'Em Formação' | 'Destaque' | 'Craque da Turma';
  attendance_rate?: number; // % presença nos últimos 30 dias
  consecutive_absences?: number; // Radar de evasão
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  plan_id: string;
  payer_guardian_id: string;
  start_date: string;
  end_date?: string;
  agreed_amount: number;
  discount_type?: DiscountType;
  discount_value?: number;
  scholarship_notes?: string;
  due_day: number;
  status: EnrollmentStatus;
}

export interface Session {
  id: string;
  class_id: string;
  class_name?: string;
  modality_name?: string;
  coach_profile_id?: string;
  coach_name?: string;
  scheduled_date: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  is_cancelled: boolean;
  cancellation_reason?: string;
  attendance_completed?: boolean;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name?: string;
  status: AttendanceStatus;
  notes?: string;
  recorded_by?: string;
  recorded_at: string;
}

export interface Charge {
  id: string;
  enrollment_id: string;
  student_name: string;
  guardian_name: string;
  guardian_phone: string;
  class_name: string;
  competence: string;
  due_date: string;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  paid_amount: number;
  status: ChargeStatus;
  notes?: string;
}

export interface Payment {
  id: string;
  paid_at: string;
  amount: number;
  method: PaymentMethod;
  reference_code?: string;
  recorded_by?: string;
  is_reversed: boolean;
}

// ==========================================
// MÓDULO: DESENVOLVIMENTO DO ATLETA (7 DIMENSÕES)
// ==========================================

export type MasteryLevel = 1 | 2 | 3 | 4 | 5;

export interface MasteryLevelDefinition {
  level: MasteryLevel;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badgeColor: string;
}

export type AssessmentDimensionKey = 
  | 'tecnico' 
  | 'tatico' 
  | 'fisico_motor' 
  | 'comportamento' 
  | 'aprendizagem' 
  | 'autonomia' 
  | 'jogo';

export interface AssessmentDimensionInfo {
  key: AssessmentDimensionKey;
  number: number;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export interface SkillCriterion {
  id: string;
  dimension: AssessmentDimensionKey;
  name: string;
  description: string;
  applicable_positions: SoccerPosition[] | 'all';
}

export interface AssessmentScore {
  criterion_id: string;
  criterion_name: string;
  dimension: AssessmentDimensionKey;
  level: MasteryLevel;
  evidence_notes?: string;
}

export interface AthleteGoal {
  id: string;
  student_id: string;
  dimension: AssessmentDimensionKey;
  title: string;
  description: string;
  target_date: string;
  status: 'active' | 'in_progress' | 'completed';
  created_at: string;
}

export interface AthleteAssessment {
  id: string;
  student_id: string;
  student_name: string;
  position: SoccerPosition;
  class_id: string;
  class_name: string;
  coach_name: string;
  cycle_name: string; // Ex: "Ciclo 1 - Ago", "Ciclo 2 - Set", "Ciclo 3 - Out"
  assessed_at: string;
  scores: AssessmentScore[];
  dimension_averages: Record<AssessmentDimensionKey, number>;
  overall_average: number;
  strengths: string[];
  interventions: string[];
  coach_notes: string;
  goals: AthleteGoal[];
}

// ==========================================
// MÓDULO: SCOUT DO JOGADOR (JOGO E TREINO)
// ==========================================

export type ScoutEventType = 'coletivo_treino' | 'amistoso' | 'campeonato';

export interface MatchScoutStats {
  id: string;
  student_id: string;
  student_name: string;
  position: SoccerPosition;
  match_type: ScoutEventType;
  match_date: string;
  opponent_context: string;
  minutes_played: number;
  
  // Ações Positivas (O que fez de bom)
  goals: number;
  assists: number;
  passes_completed: number;
  tackles_successful: number; // Desarmes
  saves_or_blocks: number; // Defesas / Bloqueios
  dribbles_successful: number;
  fouls_received: number;
  
  // Ações a Corrigir (O que precisa melhorar / falhas)
  passes_missed: number;
  balls_lost: number; // Perdas de posse
  shots_off_target: number; // Finalizações erradas
  fouls_committed: number;
  yellow_cards: number;
  red_cards: number;
  marking_lapses: number; // Perda de marcação
  
  overall_rating: number; // Nota do jogo (0 a 10)
  coach_notes: string;
}

export interface TrainingPhysicalScout {
  id: string;
  student_id: string;
  evaluated_at: string;
  coach_name: string;
  
  // Medições e Notas Físico-Motoras (1 a 100 ou tempo)
  speed_20m_sec: number; // Tempo sprint (segundos)
  speed_rating: number; // Velocidade (1 a 100)
  
  strength_rating: number; // Força corporal & impacto (1 a 100)
  shot_power_kmh: number; // Potência de chute estimada (km/h)
  
  agility_circuit_sec: number; // Teste de agilidade cones (segundos)
  coordination_rating: number; // Coordenação motora (1 a 100)
  
  endurance_rating: number; // Resistência e fôlego (1 a 100)
  
  // Observações de Treino
  strengths_in_training: string[]; // O que foi ótimo no treino
  improvements_in_training: string[]; // O que falhou no treino
  overall_physical_score: number; // Média física global
}


