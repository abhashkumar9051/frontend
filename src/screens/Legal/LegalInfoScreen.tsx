import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type LegalInfoType = "privacy" | "terms" | "deletion";

type Props = NativeStackScreenProps<AppStackParamList, "LegalInfo">;

const privacy: [string, string][] = [
  [
    "1. Who We Are",
    "GenZExam is an independent educational platform operated by Abhash Kumar from Aurangabad, Bihar, India. We provide exam preparation, practice tests, online test series and related learning services. For privacy-related questions or requests, contact us at genz@gmail.com.",
  ],
  [
    "2. Information We Collect",
    "We may collect the following information: (a) mobile number and OTP verification details; (b) Google account identifier, name, email address and profile image if you choose Google Sign-In; (c) test answers, scores, accuracy, time taken and test attempt history; (d) exam access, order details, payment status and transaction identifiers; and (e) support messages and basic technical or security information.",
  ],
  [
    "3. How We Use Your Information",
    "We use your information to create and secure user accounts, verify sign-ins, provide online tests and results, save learning progress, grant access to purchased test series, process and reconcile payments, respond to support requests, prevent fraud and misuse, improve our services and comply with applicable legal obligations. We do not sell your personal information.",
  ],
  [
    "4. Sharing and Payments",
    "We may share necessary information with trusted service providers supporting hosting, authentication, OTP delivery, payment processing, customer support and security. Information may also be disclosed to government authorities where required by applicable law. Payments are processed through third-party payment providers such as Razorpay under their respective terms and privacy policies. We do not store your complete card details, UPI PIN or banking passwords.",
  ],
  [
    "5. Data Retention and Your Rights",
    "We retain personal information for as long as necessary to provide our services, maintain learning history, manage purchases, resolve disputes and meet legal, tax, accounting and security requirements. You may request access to, correction of or deletion of your personal information by contacting genz@gmail.com. We may verify your identity before processing requests. Certain records may be retained where required or permitted by law.",
  ],
  [
    "6. Data Security, Children and Third-Party Services",
    "We take reasonable technical and organizational measures to protect personal information against unauthorized access, alteration, disclosure or destruction. However, no online service can guarantee absolute security. Users under 18 should use our services with the permission and supervision of a parent or legal guardian. Third-party services such as Google and Razorpay have their own privacy policies. Essential storage technologies may be used for authentication, preferences and security.",
  ],
  [
    "7. Grievance Officer and Contact Details",
    "For privacy complaints, questions or requests, contact our Grievance Officer: Abhash Kumar, Grievance Officer, GenZExam, Aurangabad, Bihar, India. Email: genz@gmail.com. Availability: Monday to Friday, 10:00 AM to 6:00 PM IST. We aim to address complaints within the period required by applicable law.",
  ],
  [
    "8. Changes to This Privacy Policy",
    "We may update this Privacy Policy from time to time. Updated versions will be published on our website and may also be displayed in the application. The latest effective date will indicate when the policy was last updated.",
  ],
];

const terms: [string, string][] = [
  [
    "1. Agreement and Eligibility",
    "These Terms and Conditions govern the use of GenZExam, including its website, mobile application, online tests, practice questions, test series and related educational services. By accessing or using GenZExam, you agree to these Terms and our Privacy Policy. You must be legally capable of accepting these Terms. Users under 18 must have permission and supervision from a parent or legal guardian.",
  ],
  [
    "2. User Account and Security",
    "Users must provide accurate information when registering. You are responsible for protecting access to your registered mobile number, OTPs and Google account. Do not share OTPs or allow unauthorized persons to access your account. You must inform us promptly if you suspect unauthorized access. We reserve the right to restrict or suspend accounts involved in fraud, misuse or violation of these Terms.",
  ],
  [
    "3. Educational Content and Test Results",
    "GenZExam provides mock tests, practice questions, Previous Year Questions (PYQs), explanations, performance reports and other educational resources. We make reasonable efforts to maintain accuracy, but we do not guarantee that every question, answer or explanation will always be error-free. Test scores and rankings are intended for practice and self-assessment. We do not guarantee examination success, admission, employment or any particular result.",
  ],
  [
    "4. Paid Services and Payments",
    "Some test series, examinations or features may require payment. Prices and included features will be displayed before checkout, in Indian Rupees (INR) unless stated otherwise. Payments may be processed through Razorpay or another identified payment provider. Access is granted after successful payment verification. Purchased exam packages currently provide access for six months from the date of purchase, unless a different validity is displayed at checkout or in the user's profile. If payment is successful but access is not provided, contact genz@gmail.com with the transaction reference.",
  ],
  [
    "5. Cancellation and Refund Policy",
    "Digital services may become available immediately after successful payment. Refunds are generally not provided after access to a purchased digital test series has been granted, except where required by applicable law or in cases of duplicate, failed or otherwise eligible transactions. For payment-related complaints or refund requests, contact genz@gmail.com. Nothing in these Terms limits consumer rights that cannot legally be excluded.",
  ],
  [
    "6. Acceptable Use",
    "Users agree to use GenZExam only for lawful personal educational purposes. Users must not copy, reproduce, publish, distribute, resell or commercially exploit our content without written permission. Users must not hack, disrupt, reverse engineer, scrape, upload malicious code, manipulate test results or bypass payment and access controls.",
  ],
  [
    "7. Intellectual Property",
    "The GenZExam name, logo, software, website design and original educational content are owned by GenZExam or its respective licensors and are protected by applicable intellectual property laws. Users receive limited, personal, non-exclusive, non-transferable and revocable permission to use the platform for educational purposes while their access remains valid.",
  ],
  [
    "8. Service Availability and Third-Party Services",
    "We aim to provide uninterrupted access to our services but do not guarantee continuous availability. Maintenance, technical issues, network failures, security incidents or circumstances beyond our control may temporarily affect the platform. Third-party services such as Google Sign-In and payment gateways operate independently and are subject to their own terms.",
  ],
  [
    "9. Account Suspension and Termination",
    "We may suspend or terminate access to an account if we reasonably believe that the user has violated these Terms, engaged in fraudulent activity or misused the platform. Users may request account deletion in accordance with our Account Deletion Policy.",
  ],
  [
    "10. Limitation of Liability",
    "To the extent permitted by applicable law, GenZExam shall not be liable for indirect losses arising from temporary service interruptions, internet connectivity problems, device failures or reliance on educational content. Nothing in these Terms excludes liability that cannot legally be excluded.",
  ],
  [
    "11. Governing Law and Jurisdiction",
    "These Terms shall be governed by the laws of India. Subject to mandatory consumer protection laws and applicable jurisdiction requirements, disputes shall be brought before a court of competent jurisdiction.",
  ],
  [
    "12. Contact and Legal Information",
    "Platform Name: GenZExam. Operated by: Abhash Kumar. Location: Aurangabad, Bihar, India. Email: genz@gmail.com. Grievance Officer: Abhash Kumar.",
  ],
  [
    "13. Changes to These Terms",
    "We may revise these Terms from time to time. Updated Terms will be published on our website. Continued use of GenZExam after publication of updated Terms will be subject to the revised Terms, to the extent permitted by applicable law.",
  ],
];

const accountDeletion: [string, string][] = [
  [
    "1. Introduction",
    "GenZExam provides users with a way to request deletion of their account and associated personal information. Account deletion is subject to identity verification and applicable legal requirements.",
  ],
  [
    "2. How to Request Account Deletion",
    "You can request account deletion from the Delete Account option in the GenZExam app, if available. You can also email genz@gmail.com with the subject Account Deletion Request. Include your registered mobile number and registered email address, if any. Never send your password or OTP by email.",
  ],
  [
    "3. Verification",
    "We may verify that you own the account before processing a deletion request. We may ask for reasonable additional information where necessary to prevent unauthorized deletion.",
  ],
  [
    "4. Information That May Be Deleted",
    "After verification, we will delete or anonymize personal information associated with your account where applicable, which may include your profile details, registered mobile number, email address, saved preferences, test history and performance records, subject to legal and technical requirements.",
  ],
  [
    "5. Information That May Be Retained",
    "We may retain limited information where required or permitted by law, including payment and transaction records, tax and accounting records, records needed to resolve disputes, prevent fraud, maintain security or comply with legal obligations. Any retained information will be handled in accordance with applicable law.",
  ],
  [
    "6. Processing Time",
    "We aim to process verified deletion requests within 30 days. If additional time is required for legal, security or technical reasons, we will communicate this where appropriate.",
  ],
  [
    "7. Effect of Account Deletion",
    "Once deletion is completed, you may lose access to your account, test history, saved preferences, purchased content and other account-related services. Deletion may be irreversible. Please check any active purchases before submitting a request.",
  ],
  [
    "8. Contact Information",
    "Platform: GenZExam. Operated by: Abhash Kumar. Location: Aurangabad, Bihar, India. Email: genz@gmail.com. Grievance Officer: Abhash Kumar.",
  ],
];

export default function LegalInfoScreen({ navigation, route }: Props) {
  const type = route.params.type as LegalInfoType;

  const pageConfig: Record<
    LegalInfoType,
    { heading: string; sections: [string, string][] }
  > = {
    privacy: { heading: "Privacy Policy", sections: privacy },
    terms: { heading: "Terms & Conditions", sections: terms },
    deletion: {
      heading: "Account Deletion Policy",
      sections: accountDeletion,
    },
  };

  const page = pageConfig[type] ?? pageConfig.privacy;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{page.heading}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>
          GenZExam · Effective 9 November 2026
        </Text>

        {page.sections.map(([title, body]) => (
          <View key={title} style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          For assistance, contact genz@gmail.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  header: {
    minHeight: 60,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  back: {
    color: "white",
    fontSize: 36,
    width: 32,
  },
  headerTitle: {
    color: "white",
    fontWeight: "800",
    fontSize: 17,
  },
  content: {
    padding: 20,
    paddingBottom: 44,
  },
  brand: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 14,
  },
  section: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    color: "#20283B",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 8,
  },
  body: {
    color: "#667287",
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    color: "#667287",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 20,
    textAlign: "center",
  },
});
