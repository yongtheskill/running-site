import 'package:flutter/material.dart';
import 'dart:async';

import 'package:receive_sharing_intent/receive_sharing_intent.dart';
import 'package:running/pages/upload.dart';
import 'package:file_picker/file_picker.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  late StreamSubscription _intentSub;

  @override
  void initState() {
    super.initState();

    // Listen to media sharing coming from outside the app while the app is in the memory.
    _intentSub = ReceiveSharingIntent.instance.getMediaStream().listen((value) {
      setState(() {
        _handleSharedFiles(value);
      });
    }, onError: (err) {
      print("getIntentDataStream error: $err");
    });

    // Get the media sharing coming from outside the app while the app is closed.
    ReceiveSharingIntent.instance.getInitialMedia().then((value) {
      setState(() {
        _handleSharedFiles(value);
        // Tell the library that we are done processing the intent.
        ReceiveSharingIntent.instance.reset();
      });
    });
  }

  void _handleSharedFiles(List<SharedMediaFile> files) {
    if (files.isEmpty) return;
    final fileToUpload = files.first;
    _openUploader(fileToUpload.path);
  }

  void _openUploader(String path) {
    Navigator.push(
        context,
        MaterialPageRoute(
            builder: (context) => Upload(
                  path: path,
                )));
  }

  void _chooseFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null && result.files.single.path != null) {
      _openUploader(result.files.single.path!);
    }
  }

  @override
  void dispose() {
    _intentSub.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
            child: Center(
                child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                  const Text("https://run.yong.ee"),
      const SizedBox(height: 10,),
      ElevatedButton(
          onPressed: () {
            _chooseFile();
          },
          child: const Text("Select File"))
    ]))));
  }
}
