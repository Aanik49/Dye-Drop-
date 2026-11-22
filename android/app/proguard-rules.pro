# Keep WebView and AndroidX WebKit classes for Dye Drop
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class androidx.webkit.** { *; }
