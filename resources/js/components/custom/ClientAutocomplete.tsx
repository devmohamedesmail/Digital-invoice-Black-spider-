import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Client {
    id: number;
    name: string;
    phone: string;
    address: string;
    client_vat_number: string;
    email: string;
    company_name: string;
}

interface ClientAutocompleteProps {
    value: string;
    onChange: (value: string, client?: Client) => void;
    onClientSelect: (client: Client) => void;
    label?: string;
    placeholder?: string;
    error?: string;
}

export default function ClientAutocomplete({
    value,
    onChange,
    onClientSelect,
    label = 'Client Name',
    placeholder = 'Search or enter client name...',
    error
}: ClientAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<Client[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const searchClients = async (searchTerm: string) => {
        if (searchTerm.length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/clients/search?search=${encodeURIComponent(searchTerm)}`);
            const clients = await response.json();
            setSuggestions(clients);
            setIsOpen(clients.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Error searching clients:', error);
            setSuggestions([]);
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Clear previous debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce search
        debounceRef.current = setTimeout(() => {
            searchClients(newValue);
        }, 300);
    };

    const handleClientSelect = (client: Client) => {
        onChange(client.name, client);
        onClientSelect(client);
        setIsOpen(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleClientSelect(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleBlur = () => {
        // Delay closing to allow for click on suggestion
        setTimeout(() => {
            setIsOpen(false);
            setSelectedIndex(-1);
        }, 200);
    };

    useEffect(() => {
        // Cleanup debounce on unmount
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className="relative mb-4">
            <Label className="block text-sm font-medium text-gray-700 mb-2 arabic-font">
                {label}
            </Label>
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        onFocus={() => value.length >= 2 && setIsOpen(suggestions.length > 0)}
                        placeholder={placeholder}
                        className={`pl-10 arabic-font ${error ? 'border-red-500' : ''}`}
                        autoComplete="off"
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {isOpen && suggestions.length > 0 && (
                    <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto shadow-lg border border-gray-200">
                        <CardContent className="p-0">
                            {suggestions.map((client, index) => (
                                <div
                                    key={client.id}
                                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                        index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                    onClick={() => handleClientSelect(client)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            {client.company_name ? (
                                                <Building className="h-5 w-5 text-blue-600" />
                                            ) : (
                                                <User className="h-5 w-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 arabic-font truncate">
                                                    {client.name}
                                                </p>
                                                {client.company_name && (
                                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                                        {client.company_name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {client.phone && (
                                                    <p className="text-xs text-gray-600 arabic-font">
                                                        📞 {client.phone}
                                                    </p>
                                                )}
                                                {client.email && (
                                                    <p className="text-xs text-gray-600 arabic-font">
                                                        📧 {client.email}
                                                    </p>
                                                )}
                                                {client.client_vat_number && (
                                                    <p className="text-xs text-gray-600 arabic-font">
                                                        🏢 VAT: {client.client_vat_number}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* No results message */}
                {isOpen && suggestions.length === 0 && value.length >= 2 && !isLoading && (
                    <Card className="absolute z-50 w-full mt-1 shadow-lg border border-gray-200">
                        <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-500 arabic-font">
                                No existing clients found. This will be saved as a new client.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600 arabic-font">{error}</p>
            )}
        </div>
    );
}
