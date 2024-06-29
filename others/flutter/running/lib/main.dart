import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:running/pages/home.dart';

class AddLECert extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
  }
}



void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  HttpOverrides.global = AddLECert();
  final leRoot = await PlatformAssetBundle().load('assets/ca/lets-encrypt-r3.pem');
  SecurityContext.defaultContext.setTrustedCertificatesBytes(leRoot.buffer.asUint8List());

  await Hive.initFlutter();
  await Hive.openBox("auth");

  runApp(const RunningApp());
}

class RunningApp extends StatelessWidget {
  const RunningApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(home: Home());
  }
}
