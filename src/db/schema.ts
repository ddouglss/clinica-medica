import {pgTable, text, timestamp, uuid, integer, time, pgEnum} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
});

export const usersTableRealations = relations(usersTable, ({many}) => ({
    usersToClincs: many(usersToClincsTable),
}));

export const clientsTable = pgTable("clients", {
    id:uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new  Date()),
});

export const usersToClincsTable = pgTable("users_to_clients", {
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id),
    clientId: uuid("client_id")
        .notNull()
        .references(() => clientsTable.id),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
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
    client: one(clientsTable, {
        fields: [usersToClincsTable.clientId],
        references: [clientsTable.id],
    })
}))

export const clinicTableRelations = relations(clientsTable, ({ many }) => ({
    doctors: many(doctorsTable),
    patiens: many(patientsTable),
    appointments: many(appointmentsTable),
    usersToClincs: many(usersToClincsTable),
}));

export const doctorsTable = pgTable("doctors", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clientsTable.id, {onDelete: "cascade"}),
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
    clinic: one(clientsTable, {
        fields: [doctorsTable.clinicId],
        references: [clientsTable.id],
    }),
}));

//enum
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

export const patientsTable = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clientsTable.id, {onDelete: "cascade"}),
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
    clinic: one(clientsTable, {
        fields: [patientsTable.clinicId],
        references: [clientsTable.id],
    }),
}));

export const appointmentsTable = pgTable("appointments", {
    id: uuid("id").defaultRandom().primaryKey(),
    clinicId: uuid("clinic_id")
        .notNull()
        .references(() => clientsTable.id, {onDelete: "cascade"}),
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
    clinic: one(clientsTable, {
        fields: [appointmentsTable.clinicId],
        references: [clientsTable.id],
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