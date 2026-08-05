import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";

export interface ReminderItem {
  name: string;
  amount: number;
  dueLabel: string;
  paymentUrl?: string;
}

interface ReminderEmailProps {
  userName: string;
  items: ReminderItem[];
}

export function ReminderEmail({ userName, items }: ReminderEmailProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const preview =
    items.length === 1
      ? `${items[0]?.name} vence ${items[0]?.dueLabel}`
      : `${items.length} pagos próximos a vencer`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>Finanzas</Text>
          <Heading style={styles.heading}>
            Hola {userName.split(" ")[0]}, tienes pagos próximos
          </Heading>
          <Text style={styles.paragraph}>
            Estos son los gastos fijos que vencen pronto según tu configuración en Finanzas:
          </Text>

          <Section style={styles.itemsBox}>
            {items.map((item, i) => (
              <div key={item.name} style={i > 0 ? styles.itemRowBorder : styles.itemRow}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemDue}>{item.dueLabel}</Text>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {item.paymentUrl && (
                  <Button href={item.paymentUrl} style={styles.payButton}>
                    Pagar ahora
                  </Button>
                )}
              </div>
            ))}
          </Section>

          {items.length > 1 && <Text style={styles.total}>Total: {formatCurrency(total)}</Text>}

          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Recibiste este correo porque tienes recordatorios activados en Finanzas. Puedes
            desactivarlos desde Configuración.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f5f6f8",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    padding: "32px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    maxWidth: "480px",
    margin: "0 auto",
  },
  brand: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#2465e6",
    letterSpacing: "0.02em",
    margin: "0 0 16px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#111111",
    margin: "0 0 12px",
    lineHeight: 1.3,
  },
  paragraph: {
    fontSize: "14px",
    color: "#555555",
    lineHeight: 1.6,
    margin: "0 0 20px",
  },
  itemsBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "4px 16px",
  },
  itemRow: {
    padding: "14px 0",
  },
  itemRowBorder: {
    padding: "14px 0",
    borderTop: "1px solid #e5e7eb",
  },
  itemName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#111111",
    margin: 0,
  },
  itemDue: {
    fontSize: "12px",
    color: "#888888",
    margin: "2px 0 0",
  },
  itemAmount: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111111",
    margin: 0,
    fontFamily: "'Geist Mono', 'SF Mono', Consolas, monospace",
  },
  payButton: {
    backgroundColor: "#2465e6",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: 600,
    padding: "8px 14px",
    margin: "0 0 12px",
  },
  total: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111111",
    textAlign: "right" as const,
    margin: "16px 4px 0",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "28px 0 16px",
  },
  footer: {
    fontSize: "12px",
    color: "#9ca3af",
    lineHeight: 1.5,
    margin: 0,
  },
};
