import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, color: '#1a1a1a' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  tagline: { fontSize: 13, color: '#666', marginBottom: 20, fontStyle: 'italic' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 16, marginBottom: 8, borderBottom: '1 solid #ccc', paddingBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 5 },
  label: { width: 120, color: '#666', fontSize: 10 },
  value: { flex: 1, fontSize: 11 },
  testimonialBox: { marginBottom: 8, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 4 },
  testimonialQuote: { fontStyle: 'italic', fontSize: 10, marginBottom: 2 },
  testimonialName: { fontSize: 9, color: '#666', textAlign: 'right' },
  bandDescription: { fontSize: 10, lineHeight: 1.5, marginBottom: 12, color: '#444' },
  genreTag: { fontSize: 9, backgroundColor: '#eee', padding: '2 6', borderRadius: 3, marginRight: 4 },
  footer: { position: 'absolute', bottom: 20, left: 40, right: 40, fontSize: 9, color: '#999', textAlign: 'center', borderTop: '1 solid #eee', paddingTop: 8 },
})

export default function ProposalPDFDocument({ proposal, bandProfile }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>{bandProfile?.bandName || 'Reguleran'}</Text>
          {bandProfile?.tagline && <Text style={styles.tagline}>{bandProfile.tagline}</Text>}
          {bandProfile?.description && <Text style={styles.bandDescription}>{bandProfile.description}</Text>}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Proposal untuk {proposal.venueName}</Text>
          {proposal.proposedDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Tanggal</Text>
              <Text style={styles.value}>{proposal.proposedDate}</Text>
            </View>
          )}
          {proposal.proposedTime && (
            <View style={styles.row}>
              <Text style={styles.label}>Waktu</Text>
              <Text style={styles.value}>{proposal.proposedTime}</Text>
            </View>
          )}
          {proposal.performanceFormat && (
            <View style={styles.row}>
              <Text style={styles.label}>Format</Text>
              <Text style={styles.value}>{proposal.performanceFormat}</Text>
            </View>
          )}
          {proposal.rateOffered && (
            <View style={styles.row}>
              <Text style={styles.label}>Rate</Text>
              <Text style={styles.value}>Rp {Number(proposal.rateOffered).toLocaleString('id-ID')}</Text>
            </View>
          )}
          {proposal.rateNotes && (
            <View style={styles.row}>
              <Text style={styles.label}>Catatan Rate</Text>
              <Text style={styles.value}>{proposal.rateNotes}</Text>
            </View>
          )}
        </View>

        {bandProfile?.genres?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Genre</Text>
            <Text>{bandProfile.genres.join(', ')}</Text>
          </View>
        )}

        {proposal.testimonials?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Testimoni</Text>
            {proposal.testimonials.map((t, i) => (
              <View key={i} style={styles.testimonialBox}>
                <Text style={styles.testimonialQuote}>"{t.quote}"</Text>
                <Text style={styles.testimonialName}>— {t.name}</Text>
              </View>
            ))}
          </View>
        )}

        {bandProfile && (
          <View>
            <Text style={styles.sectionTitle}>Kontak</Text>
            {bandProfile.contactName && (
              <View style={styles.row}>
                <Text style={styles.label}>Nama</Text>
                <Text style={styles.value}>{bandProfile.contactName}</Text>
              </View>
            )}
            {bandProfile.contactPhone && (
              <View style={styles.row}>
                <Text style={styles.label}>Telepon</Text>
                <Text style={styles.value}>{bandProfile.contactPhone}</Text>
              </View>
            )}
            {bandProfile.contactEmail && (
              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{bandProfile.contactEmail}</Text>
              </View>
            )}
            {bandProfile.socialLinks?.instagram && (
              <View style={styles.row}>
                <Text style={styles.label}>Instagram</Text>
                <Text style={styles.value}>{bandProfile.socialLinks.instagram}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.footer}>Dibuat dengan Reguleran — {new Date().toLocaleDateString('id-ID')}</Text>
      </Page>
    </Document>
  )
}
