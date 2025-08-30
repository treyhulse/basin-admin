import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, XCircle, Clock, Shield, Database } from "lucide-react"

export default function TermsPage() {
  return (
    <>
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using Basin
            </p>
          </div>

          {/* Important Notice */}
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <AlertTriangle className="w-5 h-5 mr-2" />
                CRITICAL TERMS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 dark:text-red-400 font-medium">
                By using Basin, you acknowledge that this is a development platform with NO guarantees, 
                NO warranties, and significant risks. You use this service entirely at your own risk.
              </p>
            </CardContent>
          </Card>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Acceptance of Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  By accessing or using Basin ("the Service"), you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, do not use the Service.
                </p>
                <p className="text-muted-foreground">
                  <strong>IMPORTANT:</strong> These terms contain significant limitations and disclaimers. 
                  Please read them carefully.
                </p>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Basin is a <strong>development and prototyping platform</strong> that provides:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Database collection management</li>
                  <li>Data view creation</li>
                  <li>API key management</li>
                  <li>Basic user and role management</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>CRITICAL:</strong> This is NOT a production-ready service. It is intended for 
                  development, testing, and learning purposes only.
                </p>
              </CardContent>
            </Card>

            {/* No Warranties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  NO WARRANTIES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND.</strong>
                </p>
                <p className="text-muted-foreground">
                  Basin explicitly disclaims all warranties, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Warranties of merchantability</li>
                  <li>Warranties of fitness for a particular purpose</li>
                  <li>Warranties of non-infringement</li>
                  <li>Warranties of accuracy or completeness</li>
                  <li>Warranties of uninterrupted or error-free operation</li>
                  <li>Warranties of security or data protection</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>NO PROMISES:</strong> We make no promises about the Service's functionality, 
                  reliability, security, or suitability for any purpose.
                </p>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Service Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>NO UPTIME GUARANTEES:</strong> Basin may be unavailable at any time without notice:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Planned maintenance and updates</li>
                  <li>Unplanned outages and failures</li>
                  <li>Infrastructure changes</li>
                  <li>Service discontinuation</li>
                  <li>Development-related interruptions</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>NO COMPENSATION:</strong> We are not responsible for any losses or damages 
                  resulting from service unavailability.
                </p>
              </CardContent>
            </Card>

            {/* Data and Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Data and Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>NO SECURITY GUARANTEES:</strong> Basin provides NO assurances regarding:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Data encryption or protection</li>
                  <li>Access control or authentication</li>
                  <li>Vulnerability management</li>
                  <li>Compliance with security standards</li>
                  <li>Protection against data breaches</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>USE AT YOUR OWN RISK:</strong> You acknowledge that your data may be exposed 
                  to security risks and unauthorized access.
                </p>
              </CardContent>
            </Card>

            {/* Data Loss */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Data Loss and Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>HIGH RISK OF DATA LOSS:</strong> There is a significant risk that your data may be lost:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Due to software bugs or development issues</li>
                  <li>Due to database corruption or failures</li>
                  <li>Due to infrastructure changes</li>
                  <li>Due to service discontinuation</li>
                  <li>Due to lack of backup systems</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>NO RECOVERY GUARANTEES:</strong> We do not guarantee that lost data can be recovered. 
                  You are responsible for backing up your own data.
                </p>
              </CardContent>
            </Card>

            {/* Limitations of Liability */}
            <Card>
              <CardHeader>
                <CardTitle>Limitations of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Basin shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Basin shall not be liable for any loss of profits, data, or business opportunities</li>
                  <li>Basin's total liability shall not exceed the amount you paid for the Service (if any)</li>
                  <li>In no event shall Basin be liable for any damages arising from your use of the Service</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>ESSENTIAL PURPOSE:</strong> These limitations are essential to the agreement and 
                  would be agreed to even if any remedy fails of its essential purpose.
                </p>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card>
              <CardHeader>
                <CardTitle>Indemnification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You agree to indemnify, defend, and hold harmless Basin from and against any claims, 
                  damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) 
                  arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any data you upload or store on the Service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>WE MAY TERMINATE OR SUSPEND YOUR ACCESS AT ANY TIME:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Without notice or reason</li>
                  <li>For any violation of these Terms</li>
                  <li>Due to service discontinuation</li>
                  <li>Due to development or maintenance needs</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>NO COMPENSATION:</strong> Upon termination, you will not be entitled to any 
                  refunds or compensation.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>WE MAY MODIFY THESE TERMS AT ANY TIME:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Without prior notice</li>
                  <li>Without your consent</li>
                  <li>With immediate effect</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>CONTINUED USE:</strong> Your continued use of the Service after any changes 
                  constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            {/* Governing Law */}
            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                  where Basin operates, without regard to conflict of law principles.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Questions About These Terms?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have questions about these Terms of Service, please contact us. However, please 
                  understand that this is a development platform and our ability to address concerns may be limited.
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
