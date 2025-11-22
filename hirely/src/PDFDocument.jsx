// pdf/PDFDocument.jsx
import {
    Document,
    Font,
    Link,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";

// OPTIONAL: Custom fonts (you can add more)
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3H6mQ0r5fkK3lCE.ttf" },
  ],
});

// Clean PDF style
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 11,
    color: "#222",
    lineHeight: 1.45,
  },
  headerName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: "#555",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    fontSize: 10,
    color: "#333",
    marginBottom: 16,
  },
  contactItem: {
    marginRight: 12,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bold: {
    fontWeight: 700,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
  },
  jobDates: {
    fontSize: 10,
    color: "#666",
  },
  listItem: {
    marginBottom: 4,
  },
  small: {
    fontSize: 10,
  }
});

// ---- HELPER RENDER FUNCTIONS ----
const renderSection = (title, content) =>
  content ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  ) : null;

// ---- MAIN PDF DOCUMENT ----
const PDFDocument = ({ cvData }) => {
  const p = cvData.personalInfo || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <Text style={styles.headerName}>{p.name || "Your Name"}</Text>
        <Text style={styles.title}>{p.title || ""}</Text>

        {/* CONTACT */}
        <View style={styles.contactRow}>
          {p.email && (
            <Text style={styles.contactItem}>
              {p.email}
            </Text>
          )}
          {p.phone && (
            <Text style={styles.contactItem}>
              {p.phone}
            </Text>
          )}
          {p.location && (
            <Text style={styles.contactItem}>
              {p.location}
            </Text>
          )}
        </View>

        {/* SUMMARY */}
        {renderSection(
          "Professional Summary",
          p.summary && <Text>{p.summary}</Text>
        )}

        {/* SKILLS */}
        {renderSection(
          "Skills",
          <View>
            {(cvData.skills || []).map((s, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.bold}>{s.name}</Text>
                {s.bulletPoints?.length > 0 &&
                  s.bulletPoints.map((b, j) => (
                    <Text key={j} style={styles.small}>• {b}</Text>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* EXPERIENCE */}
        {renderSection(
          "Experience",
          <View>
            {(cvData.experience || []).map((job, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.jobTitle}</Text>
                  <Text style={styles.jobDates}>{job.dates}</Text>
                </View>
                <Text style={styles.small}>{job.company}</Text>
                <Text style={styles.small}>{job.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {renderSection(
          "Education",
          <View>
            {(cvData.education || []).map((edu, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  <Text style={styles.jobDates}>{edu.dates}</Text>
                </View>
                <Text style={styles.small}>{edu.institution}</Text>
                <Text style={styles.small}>{edu.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {renderSection(
          "Projects",
          <View>
            {(cvData.projects || []).map((proj, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{proj.name}</Text>
                  <Text style={styles.jobDates}>{proj.dates}</Text>
                </View>
                <Text style={styles.small}>{proj.description}</Text>
                <Text style={styles.small}>
                  Tech: {proj.technologies}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {renderSection(
          "Certifications",
          <View>
            {(cvData.certifications || []).map((c, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={styles.bold}>{c.name}</Text>
                <Text style={styles.small}>
                  {c.issuer} — {c.date}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* INTERESTS */}
        {renderSection(
          "Interests",
          cvData.interests?.length > 0 &&
            <Text>{cvData.interests.map(i => i.name).join(", ")}</Text>
        )}

        {/* PORTFOLIO LINK */}
        {p.portfolio && renderSection(
          "Portfolio",
          <Link src={p.portfolio} style={{ color: "blue" }}>
            {p.portfolio}
          </Link>
        )}

      </Page>
    </Document>
  );
};

export default PDFDocument;
