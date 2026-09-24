import {NextRequest, NextResponse} from "next/server";

export interface GeocodeResult {
	address: string | undefined;
	city: string;
	state: string;
	country: string;
	pincode: string;
	google_place_id: string;
}
interface AddressComponent {
	types: string[];
	long_name: string;
	short_name: string;
}

interface GeocodeApiResult {
	address_components?: AddressComponent[];
	formatted_address?: string;
	place_id?: string;
}

interface GeocodeApiResponse {
	status: string;
	results?: GeocodeApiResult[];
	error_message?: string;
}

export async function GET(req: NextRequest) {
	const {searchParams} = req.nextUrl;
	const lat = searchParams.get("lat");
	const lng = searchParams.get("lng");

	if (!lat || !lng) {
		return NextResponse.json(
			{error: "lat and lng are required"},
			{status: 400},
		);
	}

	const apiKey = process.env.GOOGLE_MAPS_API_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{error: "Geocoding not configured"},
			{status: 503},
		);
	}

	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
	// console.log("url ",url);
	let data: GeocodeApiResponse;
	try {
		const res = await fetch(url, {cache: "no-store"});
		// console.log("res ",res);
		if (!res.ok) {
			return NextResponse.json(
				{error: "Geocoding request failed"},
				{status: 502},
			);
		}
		data = await res.json();
	} catch {
		return NextResponse.json(
			{error: "Geocoding service unavailable"},
			{status: 502},
		);
	}
	const results = data.results;
	if (data.status !== "OK" || !results?.length) {
		return NextResponse.json({error: "No results found"}, {status: 404});
	}
	const result = results[0];
	const components: AddressComponent[] = result.address_components ?? [];

	const get = (type: string) =>
		components.find(c => c.types.includes(type))?.long_name ?? "";

	const pincode = get("postal_code");
	const city =
		get("locality") ||
		get("administrative_area_level_2") ||
		get("sublocality_level_1");
	const state = get("administrative_area_level_1");
	const country = get("country");

	// Street address: street_number + route, fallback to formatted_address first line
	const streetNumber = get("street_number");
	const route = get("route");
	const sublocality = get("sublocality_level_1") || get("sublocality");
	const address =
		[streetNumber, route, sublocality].filter(Boolean).join(", ") ||
		result?.formatted_address?.split(",")[0];

	const payload: GeocodeResult = {
		address,
		city,
		state,
		country,
		pincode,
		google_place_id: result.place_id ?? "",
	};
	// console.log("geolocation res " ,payload);

	return NextResponse.json(payload);
}
