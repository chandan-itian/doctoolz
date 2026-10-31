# Proguard rules for DocToolz Android App

-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepattributes JavascriptInterface
-keepattributes *Annotation*
-dontwarn android.webkit.**
