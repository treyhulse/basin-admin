import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Database, Clock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <>
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Important information about data handling and privacy on Basin
            </p>
          </div>

          {/* Important Notice */}
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" />
                IMPORTANT NOTICE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-400 font-medium">
                Basin is currently in early development and is NOT a mature, production-ready platform. 
                By using this service, you acknowledge and accept significant risks.
              </p>
            </CardContent>
          </Card>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Data Storage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Storage & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>NO PRIVACY EXPECTATIONS:</strong> All data stored on Basin is stored with 
                  <strong> NO expectation of privacy</strong>. This includes but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>User account information</li>
                  <li>Database collections and data</li>
                  <li>API keys and credentials</li>
                  <li>Usage logs and analytics</li>
                  <li>Any other information you provide</li>
                </ul>
                <p className="text-muted-foreground">
                  Data may be accessed, analyzed, or used for development and debugging purposes without notice.
                </p>
              </CardContent>
            </Card>

            {/* Security & Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>NO SECURITY GUARANTEES:</strong> Basin makes <strong>NO promises</strong> regarding:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Data security or encryption</li>
                  <li>Protection against unauthorized access</li>
                  <li>Compliance with security standards</li>
                  <li>Regular security updates or patches</li>
                  <li>Vulnerability management</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>USE AT YOUR OWN RISK:</strong> You acknowledge that using this service 
                  may expose your data to security vulnerabilities and unauthorized access.
                </p>
              </CardContent>
            </Card>

            {/* Data Loss & Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Data Loss & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>HIGH RISK OF DATA LOSS:</strong> Basin is in early development and there is a 
                  <strong> significant risk of data loss</strong> due to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Software bugs and development issues</li>
                  <li>Database corruption or failures</li>
                  <li>Infrastructure changes and migrations</li>
                  <li>Service interruptions or shutdowns</li>
                  <li>Lack of backup systems</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>NO BACKUP GUARANTEES:</strong> We do not guarantee that your data will be 
                  backed up or recoverable in the event of loss.
                </p>
              </CardContent>
            </Card>

            {/* Governance & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Governance & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>NO GOVERNANCE:</strong> Basin operates with <strong>no formal governance</strong> structure:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>No data retention policies</li>
                  <li>No compliance with privacy regulations (GDPR, CCPA, etc.)</li>
                  <li>No formal data handling procedures</li>
                  <li>No user rights or data portability guarantees</li>
                  <li>No formal complaint or appeal processes</li>
                </ul>
              </CardContent>
            </Card>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Platform Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Basin is currently a <strong>prototype and development platform</strong>. While our intention 
                  is to eventually provide a mature, secure, and privacy-compliant service, we are not there yet. 
                  This platform is intended for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-4">
                  <li>Development and testing purposes</li>
                  <li>Learning and experimentation</li>
                  <li>Prototyping database structures</li>
                  <li>Non-critical personal projects</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <strong>DO NOT use this platform for:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Production applications</li>
                  <li>Sensitive or confidential data</li>
                  <li>Business-critical operations</li>
                  <li>Data that cannot be lost</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions or Concerns?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have questions about this privacy policy or concerns about data handling, 
                  please contact us. However, please understand that this is a development platform 
                  and our ability to address concerns may be limited.
                </p>
                <p className="text-muted-foreground mt-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
