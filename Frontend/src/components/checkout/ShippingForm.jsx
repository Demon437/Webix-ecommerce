import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShippingForm({ address, onChange, errors = {} }) {
  const [countries, setCountries] = useState([]);

  const handleChange = (field, value) => {
    onChange({ ...address, [field]: value });
  };

  // ✅ Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2",
        );
        const data = await res.json();

        const formattedCountries = data
          .map((c) => ({
            value: c.cca2,
            label: c.name.common,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // ✅ Pincode → State + City auto fill
  const fetchLocationFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        onChange({
          ...address,
          state: postOffice.State,
          city: postOffice.District,
        });
      }
    } catch (error) {
      console.error("Pincode fetch error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-neutral-900">
        Shipping Address
      </h3>

      <div className="grid gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={address?.full_name || ""}
            onChange={(e) => handleChange("full_name", e.target.value)}
            placeholder="John Doe"
            className={`h-9 ${errors.full_name ? "border-red-500" : ""}`}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={address?.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="123 Main Street"
            className={`h-9 ${errors.address ? "border-red-500" : ""}`}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>

        {/* City & State */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={address?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
              className={`h-9 ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="state">State / Province</Label>
            <Input
              id="state"
              value={address?.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="State"
              className="h-9"
            />
          </div>
        </div>

        {/* Zip & Country */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="zip_code">ZIP / Postal Code *</Label>
            <Input
              id="zip_code"
              value={address?.zip_code || ""}
              maxLength={6}
              inputMode="numeric"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                handleChange("zip_code", value);
              }}
              onBlur={(e) => {
                const value = e.target.value;

                if (value.length === 6) {
                  fetchLocationFromPincode(value);
                }
              }}
              placeholder="Enter 6-digit PIN code"
              className={`h-9 ${errors.zip_code ? "border-red-500" : ""}`}
            />
            {errors.zip_code && (
              <p className="text-xs text-red-500">{errors.zip_code}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={address?.country || ""}
              onValueChange={(value) => handleChange("country", value)}
            >
              <SelectTrigger
                className={`h-9 ${errors.country ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>

              <SelectContent className="max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.country && (
              <p className="text-xs text-red-500">{errors.country}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={address?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+91 9876543210"
            className={`h-9 ${errors.phone ? "border-red-500" : ""}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}
