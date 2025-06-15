import {pgTable, text, timestamp, uuid, integer, time, pgEnum, boolean} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: text("id").primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const usersTableRealations = relations(usersTable, ({many}) => ({
    usersToClincs: many(usersToClincsTable),
}));

export const sessionsTable = pgTable("sessions", {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(()=> usersTable.id, { onDelete: 'cascade' })
});

export const accountsTable = pgTable("accounts", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(()=> usersTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull()
});

export const verificationsTable = pgTable("verifications", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at')
});

export const clinicsTable = pgTable("clinics", {
    id:uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new  Date()),
});

export const usersToClincsTable = pgTable("users_to_clients", {
    userId: text("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    clientId: uuid("client_id")
        .notNull()
        .references(() => clinicsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new  Date()),
});

export const usersToClincsTableRelations =
    relations(usersToClincsTable, ({one}) => ({
    user: one(usersTable, {
        fields: [usersToClincsTable.userId],
        references: [usersTable.id],
    }),
    client: one(clinicsTable, {
        fields: [usersToClincsTable.clientId],
        references: [clinicsTable.id],
    })
}))

export const clinicTableRelations = relations(clinicsTable, ({ many }) => ({
    doctors: many(doctorsTable),
    patiens: many(patientsTable),
    appointments: many(appointmentsTable),
    usersToClincs: many(usersToClincsTable),
}));

export const doctorsTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    //1-monday, 2-tuesday, 3- wednesday, 4-thursday, 5-friday, 6-saturday, 0-sunday
    availableFromWeekDay: integer("available_from_weekday_day").notNull(), // 1
    availableToWeekDay: time("available_to_week_day").notNull(), //5
    availableFromTime: time("available_from_timer").notNull(),
    speciality: text("speciality").notNull(),
    appointmentPriceInCents: integer("appointment_to_in_cents"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new  Date()),
});

export const doctorTableRelations = relations(doctorsTable, ({one}) => ({
    clinic: one(clinicsTable, {
        fields: [doctorsTable.clinicId],
        references: [clinicsTable.id],
    }),
}));

//enum
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    avatarImageUrl: text("avatar_image_url"),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    sex: patientSexEnum("sex").notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new  Date()),
});

export const patientTableRelations = relations(patientsTable, ({one}) => ({
    clinic: one(clinicsTable, {
        fields: [patientsTable.clinicId],
        references: [clinicsTable.id],
    }),
}));

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clinicsTable.id, {onDelete: "cascade"}),
    patientId: uuid("patient_id")
        .notNull()
        .references(() => patientsTable.id, {onDelete: "cascade"}),
    doctorId: uuid("doctor_id")
        .notNull()
        .references(() => doctorsTable.id, {onDelete: "cascade"}),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
});

export const appointmentTableRelations = relations(appointmentsTable, ({one}) => ({
    clinic: one(clinicsTable, {
        fields: [appointmentsTable.clinicId],
        references: [clinicsTable.id],
    }),
    patient: one(patientsTable, {
        fields: [appointmentsTable.patientId],
        references: [patientsTable.id],
    }),
    doctor: one(doctorsTable, {
        fields: [appointmentsTable.doctorId],
        references: [doctorsTable.id],
    }),
}))

